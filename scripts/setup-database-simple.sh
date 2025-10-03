#!/bin/bash

# Simplified database setup script
# This version works without sudo and focuses on the essentials

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🗄️ Setting up database (simplified version)...${NC}"

# Configuration
DB_NAME="food_truck_marketplace"
DB_USER="foodtruck_user"
DB_PASSWORD="secure_password_123"

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo -e "${RED}❌ PostgreSQL is not running. Please start it first:${NC}"
    echo "sudo systemctl start postgresql"
    exit 1
fi

# Create database and user (this will prompt for sudo password)
echo -e "${YELLOW}📊 Creating database and user...${NC}"

sudo -u postgres psql << EOF
-- Drop user and database if they exist
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Create database
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

echo -e "${GREEN}✅ Database and user created successfully!${NC}"

# Create .env.local file
echo -e "${YELLOW}📝 Creating environment configuration...${NC}"

cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

# Application Configuration
NODE_ENV=development
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Upload Configuration
UPLOAD_DIR=./public/uploads/foodtrucks
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/svg+xml
EOF

echo -e "${GREEN}✅ Environment configuration created!${NC}"

# Create uploads directory
echo -e "${YELLOW}📁 Creating uploads directory...${NC}"
mkdir -p public/uploads/foodtrucks
chmod -R 755 public/uploads

echo -e "${GREEN}✅ Database setup completed!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Run: npx prisma generate"
echo "2. Run: npx prisma db push"
echo "3. Run: npm run db:migrate (if you have existing data)"
echo "4. Run: npm run dev"
