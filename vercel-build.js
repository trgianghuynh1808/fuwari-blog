const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Step 1: Build Astro site
  console.log('📦 Building Astro site...');
  execSync('npx astro build', { stdio: 'inherit' });

  // Step 2: Run Pagefind indexing
  console.log('🔍 Running Pagefind indexing...');
  execSync('npx pagefind --site dist --force-language en', { stdio: 'inherit' });

  // Step 3: Ensure pagefind files are in the right place for Vercel
  console.log('📁 Ensuring Pagefind files are accessible...');

  // Check if pagefind directory exists
  const pagefindDir = path.join('dist', 'pagefind');
  if (fs.existsSync(pagefindDir)) {
    console.log('✅ Pagefind files generated successfully');

    // List the files to verify
    const files = fs.readdirSync(pagefindDir);
    console.log('📋 Pagefind files:', files);

    // Check if pagefind.js exists
    const pagefindJsPath = path.join(pagefindDir, 'pagefind.js');
    if (fs.existsSync(pagefindJsPath)) {
      console.log('✅ pagefind.js found at:', pagefindJsPath);
    } else {
      console.log('❌ pagefind.js not found!');
    }
  } else {
    console.log('❌ Pagefind directory not found!');
  }

  console.log('🎉 Vercel build process completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
