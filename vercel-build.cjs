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

      // Step 4: Copy pagefind files for reliable deployment...
      console.log('📋 Copying Pagefind files for reliable deployment...');
      try {
        // Copy to public directory (for direct access)
        const publicPagefindDir = path.join('public', 'pagefind');
        if (fs.existsSync(publicPagefindDir)) {
          fs.rmSync(publicPagefindDir, { recursive: true, force: true });
        }
        fs.cpSync(pagefindDir, publicPagefindDir, { recursive: true });
        console.log('✅ Copied pagefind directory to public/pagefind');

        // Copy pagefind.js to public root
        const publicPagefindJs = path.join('public', 'pagefind.js');
        fs.copyFileSync(pagefindJsPath, publicPagefindJs);
        console.log('✅ Copied pagefind.js to public root');

        // Copy essential Pagefind files to dist root (Vercel adapter preserves root files)
        const essentialFiles = [
          'pagefind-highlight.js',
          'pagefind-modular-ui.css',
          'pagefind-modular-ui.js',
          'pagefind-ui.css',
          'pagefind-ui.js',
          'wasm.en.pagefind'
        ];

        essentialFiles.forEach(file => {
          const sourceFile = path.join(pagefindDir, file);
          const destFile = path.join('dist', file);
          if (fs.existsSync(sourceFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log(`✅ Copied ${file} to dist root`);
          }
        });

        // Copy pagefind.js to dist root (already done by Pagefind)
        console.log('✅ pagefind.js already in dist root');

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
