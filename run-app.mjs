import { spawn } from 'child_process';
import { mkdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';

// Load .env if present
if (existsSync('.env')) {
  console.log('[Orchestrator] Loading environment variables from .env file...');
  const envContent = readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        process.env[key] = value;
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL || path.resolve('.local/db');
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-key-12345';
const API_PORT = '8080';
const FRONTEND_PORT = '8081';

const children = [];

function log(prefix, data, isError = false) {
  const lines = data.toString().trim().split('\n');
  const color = isError ? '\x1b[31m' : '';
  const reset = '\x1b[0m';
  for (const line of lines) {
    if (line) {
      console.log(`[${prefix}] ${color}${line}${reset}`);
    }
  }
}

function runCommand(command, args, options = {}, prefix = 'CMD') {
  return new Promise((resolve, reject) => {
    console.log(`[Orchestrator] Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      ...options,
      shell: true,
      env: { ...process.env, ...options.env }
    });

    children.push(proc);

    proc.stdout.on('data', (data) => log(prefix, data));
    proc.stderr.on('data', (data) => log(prefix, data, true));

    proc.on('close', (code) => {
      // Remove from children array
      const idx = children.indexOf(proc);
      if (idx !== -1) children.splice(idx, 1);
      
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} failed with exit code ${code}`));
      }
    });
  });
}

function startProcess(command, args, options = {}, prefix = 'PROC') {
  console.log(`[Orchestrator] Starting background process: ${command} ${args.join(' ')}`);
  const proc = spawn(command, args, {
    ...options,
    shell: true,
    env: { ...process.env, ...options.env }
  });

  children.push(proc);

  proc.stdout.on('data', (data) => log(prefix, data));
  proc.stderr.on('data', (data) => log(prefix, data, true));

  proc.on('close', (code) => {
    console.log(`[Orchestrator] Process ${prefix} exited with code ${code}`);
    const idx = children.indexOf(proc);
    if (idx !== -1) children.splice(idx, 1);
  });

  return proc;
}

async function main() {
  try {
    const isPg = DATABASE_URL.startsWith('postgres://') || DATABASE_URL.startsWith('postgresql://');
    if (!isPg) {
      console.log('[Orchestrator] Initializing local database directory...');
      mkdirSync(DATABASE_URL, { recursive: true });
    }

    // 1. Run migrations programmatically
    console.log('[Orchestrator] Applying database migrations...');
    await runCommand('pnpm', ['--filter', '@workspace/db', 'run', 'push-programmatic'], {
      env: { DATABASE_URL, NODE_ENV: 'development' }
    }, 'DB-MIGRATE');

    // 2. Seed data
    console.log('[Orchestrator] Seeding database...');
    await runCommand('pnpm', ['--filter', '@workspace/scripts', 'run', 'seed'], {
      env: { DATABASE_URL, NODE_ENV: 'development' }
    }, 'DB-SEED');

    // 3. Start backend API server
    console.log('[Orchestrator] Starting Express API Server...');
    startProcess('pnpm', ['--filter', '@workspace/api-server', 'run', 'dev'], {
      env: {
        DATABASE_URL,
        SESSION_SECRET,
        PORT: API_PORT,
        NODE_ENV: 'development'
      }
    }, 'API');

    // 4. Start frontend Vite dev server
    console.log('[Orchestrator] Starting Frontend Vite Server...');
    startProcess('pnpm', ['--filter', '@workspace/dosaji', 'run', 'dev'], {
      env: {
        PORT: FRONTEND_PORT,
        BASE_PATH: '/',
        NODE_ENV: 'development'
      }
    }, 'FRONTEND');

    console.log('\n==================================================================');
    console.log('🚀 Dosa-JI Application is starting!');
    console.log(`- Frontend: http://localhost:${FRONTEND_PORT}`);
    console.log(`- API Server: http://localhost:${API_PORT} (Proxied through Frontend /api)`);
    console.log('Press Ctrl+C to terminate all processes.');
    console.log('==================================================================\n');

  } catch (error) {
    console.error('[Orchestrator] Startup failed:', error);
    cleanup();
  }
}

function cleanup() {
  console.log('\n[Orchestrator] Shutting down all processes...');
  for (const child of children) {
    try {
      if (!child.killed) {
        child.kill('SIGINT');
      }
    } catch (e) {
      // Ignore
    }
  }
  process.exit();
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main();
