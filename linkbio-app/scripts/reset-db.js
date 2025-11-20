#!/usr/bin/env node

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const dbName = process.env.POSTGRES_DB || 'linkbio'

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: dbName,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
})

console.log('🗑️  LinkBio - Database Reset\n')
console.log('⚠️  WARNING: This will delete ALL data!\n')

async function resetDatabase() {
  let client

  try {
    client = await pool.connect()
    console.log('✅ Connected to database\n')

    console.log('🗑️  Dropping all tables...')

    await client.query(`
      DROP TABLE IF EXISTS analytics CASCADE;
      DROP TABLE IF EXISTS links CASCADE;
      DROP TABLE IF EXISTS subscriptions CASCADE;
      DROP TABLE IF EXISTS profiles CASCADE;
      DROP TABLE IF EXISTS themes CASCADE;
    `)

    console.log('✅ All tables dropped\n')

    console.log('🔨 Recreating tables...')
    const sqlPath = path.join(__dirname, '..', 'setup-local-db.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    await client.query(sql)

    console.log('✅ Tables recreated with fresh data\n')

    const users = await client.query('SELECT COUNT(*) as count FROM profiles')
    console.log(`✅ Test users created: ${users.rows[0].count}`)

    console.log('\n🎉 Database reset complete!\n')
    console.log('Test account:')
    console.log('   Email: test@example.com')
    console.log('   Password: testpass123\n')

  } catch (error) {
    console.error('\n❌ Database reset failed!')
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

resetDatabase()
