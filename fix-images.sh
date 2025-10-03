#!/bin/bash

# Quick fix script for image display issues
# Run this on your VPS to fix common image serving problems

echo "🔧 Fixing image display issues..."

# Set proper permissions for uploads directory
echo "📁 Setting upload directory permissions..."
chown -R www-data:www-data /var/www/food-truck-marketplace/public/uploads/
chmod -R 755 /var/www/food-truck-marketplace/public/uploads/

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p /var/www/food-truck-marketplace/public/uploads/foodtrucks
chown -R www-data:www-data /var/www/food-truck-marketplace/public/uploads/
chmod -R 755 /var/www/food-truck-marketplace/public/uploads/

# Test Nginx configuration
echo "⚙️ Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Restart the application
echo "🔄 Restarting application..."
pm2 restart food-truck-marketplace

# Check if everything is running
echo "📊 Checking services..."
echo "Nginx status:"
systemctl is-active nginx

echo "PM2 status:"
pm2 status

echo "✅ Image display fix complete!"
echo ""
echo "🧪 Test your images at:"
echo "https://your-domain.com/admin"
echo ""
echo "📝 If images still don't display, check:"
echo "1. File permissions: ls -la /var/www/food-truck-marketplace/public/uploads/"
echo "2. Nginx logs: tail -f /var/log/nginx/error.log"
echo "3. App logs: pm2 logs food-truck-marketplace"
