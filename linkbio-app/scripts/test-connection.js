#!/usr/bin/env node

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'linkbio',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
})

console.log('🔍 Testing PostgreSQL connection...\n')
console.log('Configuration:')
console.log(`  Host: ${pool.options.host}`)
console.log(`  Port: ${pool.options.port}`)
console.log(`  Database: ${pool.options.database}`)
console.log(`  User: ${pool.options.user}`)
console.log('')

async function testConnection() {
  try {
    // Test basic connection
    const client = await pool.connect()
    console.log('✅ Successfully connected to PostgreSQL')

    // Test database version
    const versionResult = await client.query('SELECT version()')
    console.log(`✅ PostgreSQL Version: ${versionResult.rows[0].version.split(' ')[0]} ${versionResult.rows[0].version.split(' ')[1]}`)

    // List tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    if (tablesResult.rows.length > 0) {
      console.log('\n✅ Tables found:')
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    } else {
      console.log('\n⚠️  No tables found. Run the initialization script:')
      console.log('   npm run init-db')
    }

    // Count users
    try {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM profiles')
      console.log(`\n✅ Users in database: ${usersResult.rows[0].count}`)

      if (usersResult.rows[0].count > 0) {
        const testUser = await client.query("SELECT username, email FROM profiles WHERE email = 'test@example.com'")
        if (testUser.rows.length > 0) {
          console.log('✅ Test user found:')
          console.log(`   Username: ${testUser.rows[0].username}`)
          console.log(`   Email: ${testUser.rows[0].email}`)
          console.log('   Password: testpass123')
        }
      }
    } catch (e) {
      console.log('\n⚠️  Tables not initialized yet')
    }

    client.release()

    console.log('\n🎉 Connection test successful!')
    console.log('\nNext steps:')
    console.log('  1. Run: npm run init-db (if tables not created)')
    console.log('  2. Run: npm run dev')
    console.log('  3. Open: http://localhost:3000')

  } catch (error) {
    console.error('\n❌ Connection failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('  1. Make sure PostgreSQL is running')
    console.error('  2. Check database credentials in .env.local')
    console.error('  3. Verify database "linkbio" exists')
    console.error('  4. Check PostgreSQL is accepting connections on port 5432')
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()
