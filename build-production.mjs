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

  // Run database migrations and seeding
  console.log('Checking database status and running migrations...');
  try {
    console.log('Applying database migrations...');
    execSync('pnpm --filter @workspace/db run push-programmatic', { stdio: 'inherit' });
    
    console.log('Seeding database...');
    execSync('pnpm --filter @workspace/scripts run seed', { stdio: 'inherit' });
    console.log('Database initialized successfully!');
  } catch (dbError) {
    console.log('\n⚠️ Database migration/seeding was skipped or failed.');
    console.log('Reason:', dbError.message || dbError);
    console.log('Note: This is expected if your local machine does not have IPv6 internet connectivity to Supabase.');
    console.log('The build will continue, and Hostinger will run migrations successfully during deployment.\n');
  }

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
