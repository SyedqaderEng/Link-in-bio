#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 LinkBio - Local Database Initialization${NC}"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed or not in PATH${NC}"
    echo "Please install PostgreSQL first: https://www.postgresql.org/download/"
    exit 1
fi

# Database credentials
DB_HOST=${POSTGRES_HOST:-localhost}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-linkbio}
DB_USER=${POSTGRES_USER:-postgres}
DB_PASSWORD=${POSTGRES_PASSWORD:-postgres}

echo -e "${BLUE}📋 Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if database exists, create if it doesn't
echo -e "${BLUE}🔍 Checking if database exists...${NC}"
export PGPASSWORD=$DB_PASSWORD
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" != "1" ]; then
    echo -e "${BLUE}📦 Creating database '$DB_NAME'...${NC}"
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create database${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Database already exists${NC}"
fi

echo ""
echo -e "${BLUE}🔨 Running database schema...${NC}"

# Run the setup SQL script
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f setup-local-db.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Database initialized successfully!${NC}"
    echo ""
    echo -e "${BLUE}📝 Test Account Created:${NC}"
    echo "  Email: test@example.com"
    echo "  Password: testpass123"
    echo "  Username: testuser"
    echo ""
    echo -e "${BLUE}🌐 Next Steps:${NC}"
    echo "  1. Start the development server: ${GREEN}npm run dev${NC}"
    echo "  2. Open: ${GREEN}http://localhost:3000${NC}"
    echo "  3. Login with test account"
    echo "  4. View test profile: ${GREEN}http://localhost:3000/testuser${NC}"
    echo ""
    echo -e "${GREEN}🎉 Ready to test!${NC}"
else
    echo ""
    echo -e "${RED}❌ Database initialization failed${NC}"
    echo "Please check the error messages above"
    exit 1
fi
