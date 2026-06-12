import pg from 'pg';

const regions = [
  'ap-south-1',     // Mumbai
  'ap-southeast-1', // Singapore
  'us-east-1',      // N. Virginia
  'us-west-1',      // N. California
  'eu-central-1',   // Frankfurt
  'eu-west-1',      // Ireland
];

const ports = [6543, 5432];

async function testConfig(region, port) {
  const connectionString = `postgresql://postgres.dtfduvzgdatrkesvwszu:wBUCTN5MgCMamEZC@aws-0-${region}.pooler.supabase.com:${port}/postgres`;
  console.log(`Testing: ${region} on port ${port}...`);
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected to ${region} on port ${port}`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const region of regions) {
    for (const port of ports) {
      const success = await testConfig(region, port);
      if (success) {
        console.log(`\nFound working configuration: ${region} on port ${port}`);
        process.exit(0);
      }
    }
  }
  console.log('\nCould not connect to any pooler configuration.');
  process.exit(1);
}

main();
