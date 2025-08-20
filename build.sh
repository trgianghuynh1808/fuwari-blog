#!/bin/bash
echo "Building Astro site..."
npx astro build

echo "Running Pagefind indexing..."
npx pagefind --site dist --force-language en

echo "Build complete!"
