#!/usr/bin/env node

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: 'postgres', // Connect to default DB first
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
})

const dbName = process.env.POSTGRES_DB || 'linkbio'

console.log('🚀 LinkBio - Database Initialization\n')
console.log('📋 Configuration:')
console.log(`   Host: ${pool.options.host}`)
console.log(`   Port: ${pool.options.port}`)
console.log(`   Database: ${dbName}`)
console.log(`   User: ${pool.options.user}\n`)

async function initializeDatabase() {
  let client

  try {
    // Connect to PostgreSQL
    console.log('🔍 Connecting to PostgreSQL...')
    client = await pool.connect()
    console.log('✅ Connected successfully\n')

    // Check if database exists
    console.log(`🔍 Checking if database '${dbName}' exists...`)
    const dbCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    )

    if (dbCheck.rows.length === 0) {
      console.log(`📦 Creating database '${dbName}'...`)
      await client.query(`CREATE DATABASE ${dbName}`)
      console.log('✅ Database created\n')
    } else {
      console.log('✅ Database already exists\n')
    }

    client.release()

    // Connect to the linkbio database
    const linkbioPool = new Pool({
      host: pool.options.host,
      port: pool.options.port,
      database: dbName,
      user: pool.options.user,
      password: pool.options.password,
    })

    const linkbioClient = await linkbioPool.connect()

    // Read and execute SQL file
    console.log('🔨 Running database schema...')
    const sqlPath = path.join(__dirname, '..', 'setup-local-db.sql')

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found: ${sqlPath}`)
    }

    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Execute the SQL
    await linkbioClient.query(sql)

    console.log('✅ Database schema executed successfully\n')

    // Verify setup
    console.log('🔍 Verifying setup...')
    const tables = await linkbioClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('✅ Tables created:')
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })

    const users = await linkbioClient.query('SELECT COUNT(*) as count FROM profiles')
    console.log(`\n✅ Users created: ${users.rows[0].count}`)

    const testUser = await linkbioClient.query(
      "SELECT username, email FROM profiles WHERE email = 'test@example.com'"
    )

    if (testUser.rows.length > 0) {
      console.log('\n✅ Test account created:')
      console.log(`   Email: ${testUser.rows[0].email}`)
      console.log(`   Username: ${testUser.rows[0].username}`)
      console.log(`   Password: testpass123`)
    }

    linkbioClient.release()
    await linkbioPool.end()

    console.log('\n🎉 Database initialization complete!\n')
    console.log('🌐 Next Steps:')
    console.log('   1. Start server: npm run dev')
    console.log('   2. Open: http://localhost:3000')
    console.log('   3. Login with test account')
    console.log('   4. View profile: http://localhost:3000/testuser\n')
    console.log('✅ Ready to test!\n')

  } catch (error) {
    console.error('\n❌ Database initialization failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('  1. Make sure PostgreSQL is running')
    console.error('  2. Check credentials in .env.local')
    console.error('  3. Verify PostgreSQL accepts connections on port 5432')
    console.error('  4. Check PostgreSQL logs for details')
    process.exit(1)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

initializeDatabase()
