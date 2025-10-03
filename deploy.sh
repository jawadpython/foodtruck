#!/bin/bash

# Food Truck Marketplace Deployment Script for Ubuntu VPS
# Run this script as root or with sudo

set -e

echo "🚀 Starting Food Truck Marketplace deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="food-truck-marketplace"
APP_DIR="/var/www/$APP_NAME"
NGINX_SITE="food-truck-marketplace"
DOMAIN="your-domain.com"  # Replace with your actual domain
NODE_VERSION="18"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "App Name: $APP_NAME"
echo "App Directory: $APP_DIR"
echo "Domain: $DOMAIN"
echo "Node Version: $NODE_VERSION"
echo ""

# Update system
echo -e "${YELLOW}🔄 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Node.js
echo -e "${YELLOW}📦 Installing Node.js $NODE_VERSION...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo -e "${YELLOW}📦 Installing PM2...${NC}"
npm install -g pm2

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
apt install -y nginx

# Create app directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR

# Create uploads directory with proper permissions
echo -e "${YELLOW}📁 Setting up uploads directory...${NC}"
mkdir -p $APP_DIR/public/uploads/foodtrucks
chown -R www-data:www-data $APP_DIR/public/uploads
chmod -R 755 $APP_DIR/public/uploads

# Copy Nginx configuration
echo -e "${YELLOW}⚙️ Configuring Nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/$NGINX_SITE

# Replace domain placeholder
sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/$NGINX_SITE

# Enable the site
ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Create PM2 ecosystem file
echo -e "${YELLOW}⚙️ Creating PM2 configuration...${NC}"
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME.log',
    time: true
  }]
};
EOF

# Create log directory for PM2
mkdir -p /var/log/pm2
chown -R www-data:www-data /var/log/pm2

echo -e "${GREEN}✅ Deployment setup complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Copy your Next.js project files to $APP_DIR"
echo "2. Run 'npm install' in the project directory"
echo "3. Run 'npm run build' to build the project"
echo "4. Start the application with PM2: 'pm2 start ecosystem.config.js'"
echo "5. Save PM2 configuration: 'pm2 save'"
echo "6. Setup PM2 to start on boot: 'pm2 startup'"
echo ""
echo -e "${YELLOW}🔧 Useful commands:${NC}"
echo "• View logs: pm2 logs $APP_NAME"
echo "• Restart app: pm2 restart $APP_NAME"
echo "• Stop app: pm2 stop $APP_NAME"
echo "• Monitor: pm2 monit"
echo "• Nginx status: systemctl status nginx"
echo "• Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
echo -e "${GREEN}🎉 Your VPS is ready for deployment!${NC}"
