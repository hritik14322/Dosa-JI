import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { mkdirSync } from 'fs';
import path from 'path';

async function main() {
  const dbDir = path.resolve('.local/test-db');
  mkdirSync(dbDir, { recursive: true });

  const db = await PGlite.create(dbDir);
  const server = new PGLiteSocketServer({
    db,
    port: 5432,
    host: '127.0.0.1',
  });

  await server.start();
  console.log('Test PGlite database started on port 5432!');
}

main().catch(console.error);
