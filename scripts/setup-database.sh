#!/bin/bash

# Database setup script for Food Truck Marketplace
# This script sets up PostgreSQL database and runs migrations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="food_truck_marketplace"
DB_USER="foodtruck_user"
DB_PASSWORD="your_secure_password_here"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${YELLOW}🗄️ Setting up PostgreSQL database for Food Truck Marketplace...${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    echo "Run: sudo apt update && sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}🔄 Starting PostgreSQL service...${NC}"
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Create database and user
echo -e "${YELLOW}📊 Creating database and user...${NC}"

sudo -u postgres psql << EOF
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

# Create .env file with database connection
echo -e "${YELLOW}📝 Creating environment configuration...${NC}"

cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"

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

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Generate Prisma client
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
    npx prisma generate
fi

# Run database migrations
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}🚀 Running database migrations...${NC}"
    npx prisma db push
fi

echo -e "${GREEN}🎉 Database setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Update the database password in .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000/admin to test the application"
echo ""
echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo "• View database: npx prisma studio"
echo "• Reset database: npx prisma db push --force-reset"
echo "• Generate client: npx prisma generate"
echo ""
echo -e "${GREEN}✅ Your database is ready for development!${NC}"
