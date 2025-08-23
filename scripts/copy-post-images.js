import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const contentDir = path.join(__dirname, '../src/content/posts');
const publicDir = path.join(__dirname, '../public');

// Create posts directory in public if it doesn't exist
const publicPostsDir = path.join(publicDir, 'posts');
if (!fs.existsSync(publicPostsDir)) {
  fs.mkdirSync(publicPostsDir, { recursive: true });
}

// Function to parse frontmatter from markdown file
function parseFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    if (!match) return null;

    const frontmatterContent = match[1];
    const frontmatter = {};

    // Simple YAML parser for our needs
    const lines = frontmatterContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0) {
          const key = trimmed.substring(0, colonIndex).trim();
          const value = trimmed.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
          frontmatter[key] = value;
        }
      }
    }

    return frontmatter;
  } catch (error) {
    console.error(`Error parsing frontmatter from ${filePath}:`, error);
    return null;
  }
}

// Function to copy post images
function copyPostImages() {
  try {
    let copiedCount = 0;
    let skippedCount = 0;

    console.log('🔍 Starting banner image copy process...');
    console.log(`📂 Content directory: ${contentDir}`);
    console.log(`📁 Public directory: ${publicPostsDir}`);

    // Read all post directories
    const postDirs = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📋 Found ${postDirs.length} post directories: ${postDirs.join(', ')}`);
    console.log('');

    postDirs.forEach(postDir => {
      const postContentDir = path.join(contentDir, postDir);
      const postPublicDir = path.join(publicPostsDir, postDir);

      // Find the markdown file (usually index.md)
      const files = fs.readdirSync(postContentDir);
      const markdownFile = files.find(file => file.endsWith('.md'));

      if (!markdownFile) {
        console.log(`⚠️  No markdown file found in ${postDir}`);
        skippedCount++;
        return;
      }

      // Parse frontmatter to get the image field
      const markdownPath = path.join(postContentDir, markdownFile);
      const frontmatter = parseFrontmatter(markdownPath);

      if (!frontmatter || !frontmatter.image) {
        console.log(`ℹ️  No banner image specified in ${postDir}`);
        skippedCount++;
        return;
      }

      // Clean up the image path (remove ./ prefix if present)
      const cleanImagePath = frontmatter.image.replace(/^\.\//, '');

      // Check if the banner image file exists
      const bannerImagePath = path.join(postContentDir, cleanImagePath);
      if (!fs.existsSync(bannerImagePath)) {
        console.log(`⚠️  Banner image '${frontmatter.image}' not found in ${postDir}`);
        skippedCount++;
        return;
      }

      // Create post directory in public if it doesn't exist
      if (!fs.existsSync(postPublicDir)) {
        fs.mkdirSync(postPublicDir, { recursive: true });
      }

      // Copy only the banner image
      const destPath = path.join(postPublicDir, cleanImagePath);
      fs.copyFileSync(bannerImagePath, destPath);
      console.log(`✅ Copied banner: ${postDir}/${cleanImagePath}`);
      copiedCount++;
    });

    console.log(`\n🎉 Banner images processing complete!`);
    console.log(`📄 Copied: ${copiedCount} banner images`);
    console.log(`⏭️  Skipped: ${skippedCount} posts (no banner or file not found)`);
  } catch (error) {
    console.error('❌ Error copying post images:', error);
  }
}

// Run the copy function
copyPostImages();
