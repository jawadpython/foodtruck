#!/bin/bash

# Complete VPS setup fix script for Food Truck Marketplace
# Run this script on your VPS to fix all issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Fixing VPS setup for Food Truck Marketplace...${NC}"

# Configuration
DB_NAME="food_truck_marketplace"
DB_USER="foodtruck_user"
DB_PASSWORD="secure_password_123"
DB_HOST="localhost"
DB_PORT="5432"
APP_DIR="/home/ubuntu/foodtruck"

echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo -e "${YELLOW}🗄️ Setting up database...${NC}"

# Create database and user
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

echo -e "${GREEN}✅ Database created successfully!${NC}"

# Create environment file
echo -e "${YELLOW}📝 Creating environment configuration...${NC}"

cat > $APP_DIR/.env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Upload Configuration
UPLOAD_DIR=$APP_DIR/public/uploads/foodtrucks
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/svg+xml
EOF

echo -e "${GREEN}✅ Environment configuration created!${NC}"

# Create uploads directory
echo -e "${YELLOW}📁 Creating uploads directory...${NC}"
mkdir -p $APP_DIR/public/uploads/foodtrucks
chmod -R 755 $APP_DIR/public/uploads

# Fix PM2 log directory permissions
echo -e "${YELLOW}🔧 Fixing PM2 permissions...${NC}"
sudo mkdir -p /var/log/pm2
sudo chown -R ubuntu:ubuntu /var/log/pm2
sudo chmod -R 755 /var/log/pm2

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Generate Prisma client
echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
cd $APP_DIR
npx prisma generate

# Push database schema
echo -e "${YELLOW}🚀 Setting up database schema...${NC}"
npx prisma db push

echo -e "${GREEN}✅ Database schema created!${NC}"

# Migrate existing data if JSON file exists
if [ -f "$APP_DIR/data/foodtrucks.json" ]; then
    echo -e "${YELLOW}📊 Migrating existing data...${NC}"
    node scripts/migrate-data.js
    echo -e "${GREEN}✅ Data migration completed!${NC}"
else
    echo -e "${YELLOW}⚠️ No existing data file found, skipping migration${NC}"
fi

# Build the application
echo -e "${YELLOW}🏗️ Building application...${NC}"
npm run build

echo -e "${GREEN}✅ Build completed!${NC}"

# Start with PM2
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo -e "${GREEN}🎉 VPS setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo "• PostgreSQL installed and configured"
echo "• Database '$DB_NAME' created with user '$DB_USER'"
echo "• Environment variables configured"
echo "• Upload directory created"
echo "• PM2 permissions fixed"
echo "• Application built and started"
echo ""
echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo "• View logs: pm2 logs food-truck-marketplace"
echo "• Restart app: pm2 restart food-truck-marketplace"
echo "• Database browser: npx prisma studio"
echo "• Check status: pm2 status"
echo ""
echo -e "${GREEN}✅ Your application should now be running!${NC}"
