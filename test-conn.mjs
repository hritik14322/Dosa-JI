import pg from 'pg';

const regions = [
  'ap-south-1', // Mumbai
  'ap-southeast-1', // Singapore
  'us-east-1', // N. Virginia
  'us-west-1', // N. California
  'eu-central-1', // Frankfurt
  'eu-west-1', // Ireland
];

async function testRegion(region) {
  const connectionString = `postgresql://postgres.dtfduvzgdatrkesvwszu:wBUCTN5MgCMamEZC@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  console.log(`Testing region: ${region}...`);
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected to pooler in region: ${region}`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED for region ${region}: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      console.log(`\nFound correct connection string for region: ${region}`);
      process.exit(0);
    }
  }
  console.log('\nCould not connect to any pooler region.');
  process.exit(1);
}

main();
