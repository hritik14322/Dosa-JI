import pg from 'pg';

async function main() {
  const connectionString = 'postgresql://postgres:wBUCTN5MgCMamEZC@[2406:da1a:314:7100:a582:83c3:1501:9061]:5432/postgres';
  console.log('Testing direct IPv6 connection to [2406:da1a:314:7100:a582:83c3:1501:9061]...');
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('✅ SUCCESS! Direct IPv6 connection established.');
    const res = await client.query('SELECT version();');
    console.log('Version:', res.rows[0].version);
    await client.end();
  } catch (err) {
    console.log('❌ FAILED:', err.stack);
  }
}

main();
