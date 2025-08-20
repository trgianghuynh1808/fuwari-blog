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

      // Step 4: Copy pagefind files to the root of dist to ensure they're accessible
      console.log('📋 Copying Pagefind files to ensure Vercel deployment...');
      try {
        // Create a copy of pagefind.js in the root of dist
        const rootPagefindJs = path.join('dist', 'pagefind.js');
        fs.copyFileSync(pagefindJsPath, rootPagefindJs);
        console.log('✅ Copied pagefind.js to dist root');

        // Also copy the entire pagefind directory to ensure all files are available
        const rootPagefindDir = path.join('dist', '_pagefind');
        if (fs.existsSync(rootPagefindDir)) {
          fs.rmSync(rootPagefindDir, { recursive: true, force: true });
        }
        fs.cpSync(pagefindDir, rootPagefindDir, { recursive: true });
        console.log('✅ Copied pagefind directory to dist/_pagefind');

      } catch (copyError) {
        console.log('⚠️ Warning: Could not copy Pagefind files:', copyError.message);
      }
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
