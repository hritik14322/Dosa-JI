import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Set environment variables for the Vite build
process.env.BASE_PATH = '/';
process.env.PORT = '3000';
process.env.NODE_ENV = 'production';

// Dynamically resolve the pnpm command using the executing package manager's path
const npmExec = process.env.npm_execpath || 'pnpm';
const pnpmCmd = npmExec.endsWith('.js') || npmExec.endsWith('.cjs')
  ? `node "${npmExec}"`
  : `"${npmExec}"`;

console.log('Starting cross-platform production build...');
console.log(`Resolved pnpm runner: ${pnpmCmd}`);

try {
  console.log('Building all workspace projects...');
  execSync(`${pnpmCmd} -r --if-present run build`, { stdio: 'inherit' });

  // Run database migrations and seeding
  console.log('Checking database status and running migrations...');
  try {
    console.log('Applying database migrations...');
    execSync(`${pnpmCmd} --filter @workspace/db run push-programmatic`, { stdio: 'inherit' });
    
    console.log('Seeding database...');
    execSync(`${pnpmCmd} --filter @workspace/scripts run seed`, { stdio: 'inherit' });
    console.log('Database initialized successfully!');
  } catch (dbError) {
    console.log('\n⚠️ Database migration/seeding was skipped or failed.');
    console.log('Reason:', dbError.message || dbError);
    console.log('Note: This is expected if your local machine does not have IPv6 internet connectivity to Supabase.');
    console.log('The build will continue, and Hostinger will run migrations successfully during deployment.\n');
  }

  const srcDir = path.resolve('artifacts/dosaji/dist/public');
  const destDir1 = path.resolve('public');
  const destDir2 = path.resolve('artifacts/api-server/dist/public');
  
  const migrationsSrc = path.resolve('lib/db/drizzle');
  const migrationsDest = path.resolve('artifacts/api-server/dist/drizzle');

  console.log('Copying built frontend to public directories...');
  if (fs.existsSync(srcDir)) {
    // Copy to root public
    fs.mkdirSync(destDir1, { recursive: true });
    fs.cpSync(srcDir, destDir1, { recursive: true, force: true });
    
    // Copy to api-server dist public
    fs.mkdirSync(destDir2, { recursive: true });
    fs.cpSync(srcDir, destDir2, { recursive: true, force: true });
    
    console.log('Frontend assets copied successfully to all destinations!');
  } else {
    console.warn(`Warning: Frontend build directory not found at "${srcDir}". Make sure "@workspace/dosaji" builds successfully.`);
  }

  console.log('Copying database migrations folder to dist...');
  if (fs.existsSync(migrationsSrc)) {
    fs.mkdirSync(migrationsDest, { recursive: true });
    fs.cpSync(migrationsSrc, migrationsDest, { recursive: true, force: true });
    console.log('Database migrations copied successfully!');
  } else {
    console.warn(`Warning: Database migrations directory not found at "${migrationsSrc}".`);
  }
  
  console.log('Build finished successfully!');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}
