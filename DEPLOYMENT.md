# 🚀 Food Truck Marketplace - VPS Deployment Guide

This guide will help you deploy your Food Truck Marketplace on an Ubuntu VPS with Nginx, ensuring that uploaded images display correctly.

## 📋 Prerequisites

- Ubuntu 20.04+ VPS
- Root or sudo access
- Domain name pointing to your VPS IP
- Basic knowledge of Linux commands

## 🛠️ Step 1: Server Setup

### 1.1 Connect to your VPS
```bash
ssh root@your-vps-ip
```

### 1.2 Run the deployment script
```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

This script will:
- Update system packages
- Install Node.js 18
- Install PM2 process manager
- Install and configure Nginx
- Create necessary directories
- Set up proper permissions

## 📁 Step 2: Deploy Your Application

### 2.1 Copy your project files
```bash
# From your local machine, upload your project
scp -r ./food-truck-marketplace root@your-vps-ip:/var/www/

# Or use git to clone your repository
cd /var/www
git clone https://github.com/your-username/food-truck-marketplace.git
mv food-truck-marketplace food-truck-marketplace
```

### 2.2 Install dependencies and build
```bash
cd /var/www/food-truck-marketplace

# Install dependencies
npm install

# Copy environment file
cp env.production.example .env.production

# Edit environment variables
nano .env.production
```

### 2.3 Configure environment variables
Edit `.env.production` with your actual values:
```bash
NODE_ENV=production
PORT=3000
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com
```

### 2.4 Build the application
```bash
npm run build
```

## 🚀 Step 3: Start the Application

### 3.1 Start with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 3.2 Verify the application is running
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs food-truck-marketplace

# Monitor in real-time
pm2 monit
```

## ⚙️ Step 4: Configure Nginx

### 4.1 Update Nginx configuration
```bash
# Edit the Nginx configuration
nano /etc/nginx/sites-available/food-truck-marketplace
```

Replace `your-domain.com` with your actual domain name.

### 4.2 Test and reload Nginx
```bash
# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## 🔒 Step 5: SSL Certificate (Recommended)

### 5.1 Install Certbot
```bash
apt install certbot python3-certbot-nginx
```

### 5.2 Obtain SSL certificate
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5.3 Test automatic renewal
```bash
certbot renew --dry-run
```

## 🧪 Step 6: Test Your Deployment

### 6.1 Test image uploads
1. Visit your domain: `https://your-domain.com`
2. Go to admin panel: `https://your-domain.com/admin`
3. Try uploading an image
4. Check if the image displays correctly

### 6.2 Verify file permissions
```bash
# Check upload directory permissions
ls -la /var/www/food-truck-marketplace/public/uploads/

# Should show:
# drwxr-xr-x www-data www-data foodtrucks/
```

### 6.3 Test image serving
```bash
# Test if Nginx serves images directly
curl -I https://your-domain.com/uploads/foodtrucks/your-image.jpg

# Should return 200 OK
```

## 🔧 Troubleshooting

### Images not displaying
1. **Check file permissions:**
   ```bash
   chown -R www-data:www-data /var/www/food-truck-marketplace/public/uploads/
   chmod -R 755 /var/www/food-truck-marketplace/public/uploads/
   ```

2. **Check Nginx configuration:**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

3. **Check application logs:**
   ```bash
   pm2 logs food-truck-marketplace
   tail -f /var/log/nginx/error.log
   ```

### Application not starting
1. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 logs food-truck-marketplace
   ```

2. **Restart the application:**
   ```bash
   pm2 restart food-truck-marketplace
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   npm --version
   ```

### Upload errors
1. **Check upload directory exists:**
   ```bash
   ls -la /var/www/food-truck-marketplace/public/uploads/foodtrucks/
   ```

2. **Check disk space:**
   ```bash
   df -h
   ```

3. **Check file size limits in Nginx:**
   ```bash
   # Add to Nginx config if needed:
   client_max_body_size 10M;
   ```

## 📊 Monitoring

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs food-truck-marketplace

# Restart application
pm2 restart food-truck-marketplace
```

### Nginx Monitoring
```bash
# Check Nginx status
systemctl status nginx

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

## 🔄 Updates and Maintenance

### Deploy updates
```bash
cd /var/www/food-truck-marketplace

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build the application
npm run build

# Restart with PM2
pm2 restart food-truck-marketplace
```

### Backup uploads
```bash
# Create backup of uploaded images
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/food-truck-marketplace/public/uploads/
```

## 🎯 Performance Optimization

### Enable Gzip compression
Already included in the Nginx configuration.

### Set up caching
Already configured for static files and images.

### Monitor resources
```bash
# Check system resources
htop
df -h
free -h
```

## 📞 Support

If you encounter any issues:

1. Check the logs first
2. Verify file permissions
3. Test Nginx configuration
4. Ensure all services are running

## 🎉 Success!

Your Food Truck Marketplace should now be running successfully on your VPS with:
- ✅ Image uploads working
- ✅ Images displaying correctly
- ✅ SSL certificate (if configured)
- ✅ Production-ready setup
- ✅ Automatic process management with PM2
- ✅ Optimized Nginx configuration

Visit your domain to see your live application!
