import pg from 'pg'
import fs from 'fs'

const { Client } = pg

const ref = 'nrawlcaoxweftuajwfwo'
const poolerUrl = process.env.DATABASE_URL_POOLER ||
  `postgresql://postgres.${ref}:9G0tJUuwdhBDIcgJ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

const client = new Client({
  connectionString: poolerUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
})

try {
  await client.connect()
  console.log('✓ Connected to Supabase Postgres (pooler)')

  const sql1 = fs.readFileSync('./supabase/migrations/00001_init_schema.sql', 'utf8')
  const sql2 = fs.readFileSync('./supabase/migrations/00002_rls_policies.sql', 'utf8')
  const seed = fs.readFileSync('./supabase/seed.sql', 'utf8')

  console.log('Running schema migration...')
  await client.query(sql1)
  console.log('✓ Schema OK')

  console.log('Running RLS policies...')
  await client.query(sql2)
  console.log('✓ RLS OK')

  console.log('Running seed...')
  await client.query(seed)
  console.log('✓ Seed OK')

  console.log('\n✅ All migrations complete!')
} catch (e) {
  console.error('Error:', e.message)
  process.exit(1)
} finally {
  await client.end()
}
