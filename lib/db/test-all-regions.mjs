import pg from 'pg';

const regions = [
  'ap-south-1',       // Mumbai
  'ap-south-2',       // Hyderabad
  'ap-southeast-1',   // Singapore
  'ap-southeast-2',   // Sydney
  'ap-northeast-1',   // Tokyo
  'ap-northeast-2',   // Seoul
  'ap-northeast-3',   // Osaka
  'ap-east-1',        // Hong Kong
  'us-east-1',        // N. Virginia
  'us-east-2',        // Ohio
  'us-west-1',        // N. California
  'us-west-2',        // Oregon
  'eu-central-1',     // Frankfurt
  'eu-central-2',     // Zurich
  'eu-west-1',        // Ireland
  'eu-west-2',        // London
  'eu-west-3',        // Paris
  'eu-north-1',       // Stockholm
  'eu-south-1',       // Milan
  'sa-east-1',        // São Paulo
  'ca-central-1',     // Canada Central
  'me-central-1',     // Middle East
  'af-south-1',       // Cape Town
];

async function testRegion(region) {
  const connectionString = `postgresql://postgres.dtfduvzgdatrkesvwszu:wBUCTN5MgCMamEZC@aws-0-${region}.pooler.supabase.com:6543/postgres`;
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
    if (!err.message.includes('tenant/user') && !err.message.includes('ENOTFOUND')) {
      console.log(`⚠️ INTERESTING response from ${region}: ${err.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('Testing connection to all 23 global Supabase regions...');
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      console.log(`\n🎉 Found correct region: ${region}`);
      process.exit(0);
    }
  }
  console.log('\nFinished testing all regions. None connected.');
  process.exit(1);
}

main();
