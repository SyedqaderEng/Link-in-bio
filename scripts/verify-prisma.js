#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Prisma Configuration...\n');

let hasErrors = false;

// Check 1: .env file exists
console.log('1. Checking .env file...');
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env file not found!');
  console.log('   Run: cp local.env .env');
  hasErrors = true;
} else {
  console.log('   ✅ .env file exists');

  // Check DATABASE_URL
  const envContent = fs.readFileSync(envPath, 'utf-8');
  if (envContent.includes('DATABASE_URL=')) {
    const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (match) {
      console.log(`   ✅ DATABASE_URL found: ${match[1]}`);
    } else {
      console.log('   ❌ DATABASE_URL format incorrect');
      hasErrors = true;
    }
  } else {
    console.log('   ❌ DATABASE_URL not found in .env');
    hasErrors = true;
  }
}

// Check 2: Prisma schema exists
console.log('\n2. Checking Prisma schema...');
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.log('   ❌ prisma/schema.prisma not found!');
  hasErrors = true;
} else {
  console.log('   ✅ prisma/schema.prisma exists');
}

// Check 3: Prisma client generated
console.log('\n3. Checking Prisma Client...');
const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
if (!fs.existsSync(prismaClientPath)) {
  console.log('   ❌ Prisma Client not generated!');
  console.log('   Run: npm run prisma:generate');
  hasErrors = true;
} else {
  console.log('   ✅ Prisma Client is generated');
}

// Check 4: @prisma/client installed
console.log('\n4. Checking @prisma/client package...');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  if (packageJson.dependencies && packageJson.dependencies['@prisma/client']) {
    console.log(`   ✅ @prisma/client installed (${packageJson.dependencies['@prisma/client']})`);
  } else {
    console.log('   ❌ @prisma/client not in dependencies!');
    console.log('   Run: npm install @prisma/client');
    hasErrors = true;
  }

  if (packageJson.devDependencies && packageJson.devDependencies['prisma']) {
    console.log(`   ✅ prisma CLI installed (${packageJson.devDependencies['prisma']})`);
  } else {
    console.log('   ⚠️  prisma CLI not in devDependencies');
  }
}

// Check 5: lib/prisma.ts exists
console.log('\n5. Checking Prisma client wrapper...');
const wrapperPath = path.join(process.cwd(), 'lib', 'prisma.ts');
if (!fs.existsSync(wrapperPath)) {
  console.log('   ❌ lib/prisma.ts not found!');
  hasErrors = true;
} else {
  console.log('   ✅ lib/prisma.ts exists');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration has errors! Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ All Prisma checks passed!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run init-db (to create database tables)');
  console.log('  2. Run: npm run dev (to start the application)');
  console.log('  3. Visit: http://localhost:3000/testuser');
  process.exit(0);
}
