import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Start the production server from the freshly compiled build artifacts
require('./artifacts/api-server/dist/bootstrap.cjs');
