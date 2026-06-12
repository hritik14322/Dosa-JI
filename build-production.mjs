import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Set environment variables for the Vite build
process.env.BASE_PATH = '/';
process.env.PORT = '3000';
process.env.NODE_ENV = 'production';

console.log('Starting cross-platform production build...');

try {
  console.log('Building all workspace projects...');
  execSync('pnpm -r --if-present run build', { stdio: 'inherit' });

  const srcDir = path.resolve('artifacts/dosaji/dist/public');
  const destDir = path.resolve('public');

  console.log(`Copying built frontend from "${srcDir}" to "${destDir}"...`);
  if (fs.existsSync(srcDir)) {
    // Ensure destination directory exists
    fs.mkdirSync(destDir, { recursive: true });
    
    // Copy built assets recursively
    fs.cpSync(srcDir, destDir, { recursive: true, force: true });
    console.log('Frontend assets copied successfully!');
  } else {
    console.warn(`Warning: Frontend build directory not found at "${srcDir}". Make sure "@workspace/dosaji" builds successfully.`);
  }
  
  console.log('Build finished successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}
