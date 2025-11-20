#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Checking project for common issues...\n')

let hasErrors = false

// Check 1: CSS @import order
console.log('1️⃣  Checking CSS file...')
const cssPath = path.join(__dirname, '..', 'app', 'globals.css')
const css = fs.readFileSync(cssPath, 'utf8')
const cssLines = css.split('\n')

const importLineIndex = cssLines.findIndex(line => line.includes('@import'))
const tailwindLineIndex = cssLines.findIndex(line => line.includes('@tailwind'))

if (importLineIndex > 0 && tailwindLineIndex > -1 && importLineIndex > tailwindLineIndex) {
  console.log('   ❌ ERROR: @import must come before @tailwind directives')
  hasErrors = true
} else if (importLineIndex === 0) {
  console.log('   ✅ CSS @import is correctly positioned at the top')
} else {
  console.log('   ℹ️  No @import found or it\'s in correct position')
}

// Check 2: PostCSS config
console.log('\n2️⃣  Checking PostCSS configuration...')
const postcssPath = path.join(__dirname, '..', 'postcss.config.js')
const postcss = fs.readFileSync(postcssPath, 'utf8')

if (postcss.includes('@tailwindcss/postcss')) {
  console.log('   ✅ Using @tailwindcss/postcss plugin (Tailwind v4)')
} else if (postcss.includes('tailwindcss')) {
  console.log('   ❌ ERROR: Should use @tailwindcss/postcss instead of tailwindcss')
  hasErrors = true
} else {
  console.log('   ⚠️  WARNING: No Tailwind PostCSS plugin found')
}

// Check 3: Proxy/Middleware file
console.log('\n3️⃣  Checking proxy configuration...')
const proxyPath = path.join(__dirname, '..', 'proxy.ts')
const middlewarePath = path.join(__dirname, '..', 'middleware.ts')

if (fs.existsSync(proxyPath)) {
  const proxy = fs.readFileSync(proxyPath, 'utf8')
  if (proxy.includes('export async function proxy')) {
    console.log('   ✅ proxy.ts exists with correct export')
  } else if (proxy.includes('export async function middleware')) {
    console.log('   ❌ ERROR: Should export "proxy" function, not "middleware"')
    hasErrors = true
  }
} else if (fs.existsSync(middlewarePath)) {
  console.log('   ❌ ERROR: middleware.ts should be renamed to proxy.ts (Next.js 15)')
  hasErrors = true
} else {
  console.log('   ⚠️  WARNING: No proxy.ts file found')
}

// Check 4: Environment files
console.log('\n4️⃣  Checking environment configuration...')
const localEnvPath = path.join(__dirname, '..', 'local.env')
const prodEnvPath = path.join(__dirname, '..', 'prod.env')
const envPath = path.join(__dirname, '..', '.env')

if (fs.existsSync(localEnvPath)) {
  console.log('   ✅ local.env template exists')
} else {
  console.log('   ❌ ERROR: local.env template missing')
  hasErrors = true
}

if (fs.existsSync(prodEnvPath)) {
  console.log('   ✅ prod.env template exists')
} else {
  console.log('   ❌ ERROR: prod.env template missing')
  hasErrors = true
}

if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists')
} else {
  console.log('   ⚠️  WARNING: .env file not found (copy local.env to .env)')
}

// Check 5: Package.json scripts
console.log('\n5️⃣  Checking npm scripts...')
const packagePath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const requiredScripts = ['dev', 'build', 'init-db', 'test-db']
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`   ✅ Script "${script}" exists`)
  } else {
    console.log(`   ❌ ERROR: Missing script "${script}"`)
    hasErrors = true
  }
})

// Check 6: Required dependencies
console.log('\n6️⃣  Checking dependencies...')
const requiredDeps = [
  '@tailwindcss/postcss',
  'next',
  'react',
  'pg',
  'bcryptjs',
  'jsonwebtoken'
]

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep} installed`)
  } else {
    console.log(`   ❌ ERROR: Missing dependency ${dep}`)
    hasErrors = true
  }
})

// Check 7: Database files
console.log('\n7️⃣  Checking database setup files...')
const setupSqlPath = path.join(__dirname, '..', 'setup-local-db.sql')
const initScriptPath = path.join(__dirname, 'init-db.js')

if (fs.existsSync(setupSqlPath)) {
  console.log('   ✅ setup-local-db.sql exists')
} else {
  console.log('   ❌ ERROR: setup-local-db.sql missing')
  hasErrors = true
}

if (fs.existsSync(initScriptPath)) {
  console.log('   ✅ scripts/init-db.js exists')
} else {
  console.log('   ❌ ERROR: scripts/init-db.js missing')
  hasErrors = true
}

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ ERRORS FOUND - Please fix the issues above')
  process.exit(1)
} else {
  console.log('✅ ALL CHECKS PASSED - Project looks good!')
  console.log('\n📝 Next steps:')
  console.log('   1. cp local.env .env')
  console.log('   2. npm run init-db')
  console.log('   3. npm run dev')
  console.log('\n🎉 Ready to go!')
  process.exit(0)
}
