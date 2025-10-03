# 🗄️ Database-Enabled Food Truck Marketplace - Complete Deployment Guide

This guide will help you deploy your Food Truck Marketplace with PostgreSQL database support for permanent image storage and management.

## 🎯 What's New

### ✅ **Database Features Added**
- **PostgreSQL Database**: Permanent storage for all data
- **Image Metadata Storage**: File names, paths, URLs, and relationships
- **Food Truck Management**: Complete CRUD operations with database
- **Data Migration**: Script to move existing JSON data to database
- **Production Ready**: Optimized for VPS deployment

### 🔧 **Technical Improvements**
- **Prisma ORM**: Type-safe database operations
- **Service Layer**: Clean separation of business logic
- **Database Connection Pooling**: Efficient connection management
- **Migration Scripts**: Automated database setup and data migration
- **Environment Configuration**: Secure database credentials

## 📋 Prerequisites

- Ubuntu 20.04+ VPS
- Root or sudo access
- Domain name pointing to your VPS IP
- Basic knowledge of Linux and PostgreSQL

## 🚀 Quick Start

### **Step 1: Deploy to VPS**

```bash
# Upload your project to VPS
scp -r ./food-truck-marketplace root@your-vps-ip:/var/www/

# Run automated deployment
cd /var/www/food-truck-marketplace
chmod +x deploy.sh
./deploy.sh
```

### **Step 2: Setup Database**

```bash
# Install dependencies
npm install

# Setup database (creates PostgreSQL database and user)
npm run db:setup

# Migrate existing data (if you have data/foodtrucks.json)
npm run db:migrate

# Build the application
npm run build
```

### **Step 3: Start Application**

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
nano /etc/nginx/sites-available/food-truck-marketplace
# Update domain name in the config
nginx -t
systemctl reload nginx
```

## 🗄️ Database Schema

### **Tables Created**

```sql
-- Food Trucks
food_trucks (id, name, description, shortDescription, category, featured, createdAt, updatedAt)

-- Images
images (id, fileName, originalName, filePath, url, mimeType, fileSize, uploadedAt, foodTruckId)

-- Specifications
specifications (id, dimensions, capacity, weight, power, foodTruckId)

-- Equipment
equipment (id, name, description, foodTruckId)

-- Features
features (id, name, description, foodTruckId)
```

### **Relationships**
- One Food Truck → Many Images
- One Food Truck → One Specification
- One Food Truck → Many Equipment
- One Food Truck → Many Features

## 🔧 Development Setup

### **Local Development**

```bash
# Install dependencies
npm install

# Setup local database
npm run db:setup

# Start development server
npm run dev
```

### **Database Management**

```bash
# View database in browser
npm run db:studio

# Reset database (careful!)
npm run db:reset

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push
```

## 📊 Data Migration

### **From JSON to Database**

If you have existing data in `data/foodtrucks.json`:

```bash
# Run migration script
npm run db:migrate
```

This will:
- Read existing JSON data
- Create database records
- Preserve all relationships
- Handle image URLs properly

### **Migration Script Features**

- ✅ **Preserves all data**: Names, descriptions, categories, etc.
- ✅ **Handles images**: Converts image URLs to database records
- ✅ **Creates relationships**: Links images to food trucks
- ✅ **Safe operation**: Doesn't overwrite existing data
- ✅ **Error handling**: Continues on individual failures

## 🚀 Production Deployment

### **Environment Configuration**

Create `.env.production`:

```bash
# Database
DATABASE_URL="postgresql://foodtruck_user:secure_password@localhost:5432/food_truck_marketplace?schema=public"

# Application
NODE_ENV=production
PORT=3000
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://your-domain.com

# Uploads
UPLOAD_DIR=/var/www/food-truck-marketplace/public/uploads/foodtrucks
```

### **Database Security**

```bash
# Change default password
sudo -u postgres psql
ALTER USER foodtruck_user PASSWORD 'your_secure_password';

# Update environment file
nano .env.production
# Update DATABASE_URL with new password
```

### **File Permissions**

```bash
# Set proper permissions
chown -R www-data:www-data /var/www/food-truck-marketplace
chmod -R 755 /var/www/food-truck-marketplace/public/uploads
```

## 🧪 Testing Your Deployment

### **Test Database Connection**

```bash
# Check if database is accessible
npm run db:studio
# Should open browser with database interface
```

### **Test Image Upload**

1. Visit: `https://your-domain.com/admin`
2. Go to Products section
3. Add/Edit a food truck
4. Upload an image
5. Save the truck
6. Check if image displays in marketplace

### **Test API Endpoints**

```bash
# Test food trucks API
curl https://your-domain.com/api/foodtrucks

# Test image upload
curl -X POST -F "file=@test-image.jpg" https://your-domain.com/api/upload
```

## 🔧 Troubleshooting

### **Database Connection Issues**

```bash
# Check PostgreSQL status
systemctl status postgresql

# Check database exists
sudo -u postgres psql -l

# Test connection
psql -h localhost -U foodtruck_user -d food_truck_marketplace
```

### **Image Upload Issues**

```bash
# Check upload directory permissions
ls -la /var/www/food-truck-marketplace/public/uploads/

# Check Nginx configuration
nginx -t

# Check application logs
pm2 logs food-truck-marketplace
```

### **Common Issues**

1. **Database not found**: Run `npm run db:setup`
2. **Permission denied**: Check file permissions
3. **Images not displaying**: Verify Nginx config
4. **Connection refused**: Check PostgreSQL service

## 📈 Performance Optimization

### **Database Optimization**

```sql
-- Add indexes for better performance
CREATE INDEX idx_food_trucks_category ON food_trucks(category);
CREATE INDEX idx_food_trucks_featured ON food_trucks(featured);
CREATE INDEX idx_images_food_truck_id ON images(foodTruckId);
```

### **Connection Pooling**

The Prisma client automatically handles connection pooling. For high-traffic sites, consider:

```bash
# Add to .env.production
DATABASE_URL="postgresql://user:pass@host:port/db?connection_limit=20&pool_timeout=20"
```

## 🔄 Maintenance

### **Regular Backups**

```bash
# Backup database
pg_dump -h localhost -U foodtruck_user food_truck_marketplace > backup_$(date +%Y%m%d).sql

# Backup uploaded images
tar -czf images_backup_$(date +%Y%m%d).tar.gz /var/www/food-truck-marketplace/public/uploads/
```

### **Updates**

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run database migrations (if schema changed)
npm run db:push

# Rebuild and restart
npm run build
pm2 restart food-truck-marketplace
```

## 🎯 Key Benefits

### **For Development**
- ✅ **Type Safety**: Prisma provides full TypeScript support
- ✅ **Easy Queries**: Simple, readable database operations
- ✅ **Local Testing**: Full database functionality locally
- ✅ **Data Migration**: Easy to move from JSON to database

### **For Production**
- ✅ **Permanent Storage**: Data persists across deployments
- ✅ **Scalable**: PostgreSQL handles high traffic
- ✅ **Reliable**: ACID compliance and data integrity
- ✅ **Maintainable**: Clean service layer architecture

## 📞 Support

### **Useful Commands**

```bash
# Database management
npm run db:studio          # Open database browser
npm run db:reset          # Reset database (careful!)
npm run db:generate       # Generate Prisma client

# Application management
pm2 status                # Check app status
pm2 logs food-truck-marketplace  # View logs
pm2 restart food-truck-marketplace  # Restart app

# System management
systemctl status postgresql  # Check database service
systemctl status nginx       # Check web server
```

### **Log Locations**

- **Application logs**: `/var/log/pm2/food-truck-marketplace.log`
- **Nginx logs**: `/var/log/nginx/error.log`
- **PostgreSQL logs**: `/var/log/postgresql/postgresql-*.log`

## 🎉 Success!

Your Food Truck Marketplace now has:

- ✅ **Permanent image storage** in PostgreSQL database
- ✅ **Complete CRUD operations** for food trucks and images
- ✅ **Production-ready deployment** with proper security
- ✅ **Data migration tools** for existing data
- ✅ **Scalable architecture** for future growth

**Your images are now permanently stored and will display correctly on your live website!** 🎉
