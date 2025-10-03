# 🔧 VPS Setup Fix Guide

## 🚨 **Issues Identified**

1. **PostgreSQL not installed** on your VPS
2. **Missing DATABASE_URL** environment variable
3. **PM2 permission issues** with log directory
4. **Database setup script** needs PostgreSQL to be installed first

## 🛠️ **Step-by-Step Fix**

### **Step 1: Install PostgreSQL on your VPS**

SSH into your VPS and run:

```bash
# Update system packages
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### **Step 2: Create Database and User**

```bash
# Switch to postgres user and create database
sudo -u postgres psql

# In the PostgreSQL prompt, run:
CREATE USER foodtruck_user WITH PASSWORD 'secure_password_123';
CREATE DATABASE food_truck_marketplace OWNER foodtruck_user;
GRANT ALL PRIVILEGES ON DATABASE food_truck_marketplace TO foodtruck_user;

# Connect to the new database
\c food_truck_marketplace;

# Grant schema privileges
GRANT ALL ON SCHEMA public TO foodtruck_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO foodtruck_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO foodtruck_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO foodtruck_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO foodtruck_user;

# Exit PostgreSQL
\q
```

### **Step 3: Create Environment File**

```bash
# Navigate to your project directory
cd /home/ubuntu/foodtruck

# Create .env.local file
cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://foodtruck_user:secure_password_123@localhost:5432/food_truck_marketplace?schema=public"

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Upload Configuration
UPLOAD_DIR=/home/ubuntu/foodtruck/public/uploads/foodtrucks
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp,image/svg+xml
EOF
```

### **Step 4: Setup Database Schema**

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### **Step 5: Migrate Existing Data**

```bash
# If you have existing data in data/foodtrucks.json
npm run db:migrate
```

### **Step 6: Fix PM2 Permissions**

```bash
# Create PM2 log directory with proper permissions
sudo mkdir -p /var/log/pm2
sudo chown -R ubuntu:ubuntu /var/log/pm2
sudo chmod -R 755 /var/log/pm2

# Install PM2 globally if not installed
sudo npm install -g pm2
```

### **Step 7: Build and Start Application**

```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🧪 **Test Your Setup**

### **Test Database Connection**

```bash
# Test database connection
psql -h localhost -U foodtruck_user -d food_truck_marketplace

# If successful, you should see the PostgreSQL prompt
# Type \q to exit
```

### **Test Application**

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs food-truck-marketplace

# Test API endpoint
curl http://localhost:3000/api/foodtrucks
```

### **Test Image Upload**

1. Visit your domain: `https://your-domain.com/admin`
2. Go to Products section
3. Try uploading an image
4. Check if it displays correctly

## 🔧 **Alternative: Use the Fix Script**

If you prefer an automated approach, upload the `fix-vps-setup.sh` script to your VPS and run:

```bash
# Make script executable
chmod +x fix-vps-setup.sh

# Run the fix script
./fix-vps-setup.sh
```

## 🚨 **Common Issues and Solutions**

### **Issue: "PostgreSQL is not installed"**
**Solution:** Run the PostgreSQL installation commands in Step 1

### **Issue: "Environment variable not found: DATABASE_URL"**
**Solution:** Create the `.env.local` file as shown in Step 3

### **Issue: "Could not create folder: /var/log/pm2"**
**Solution:** Run the PM2 permission fix in Step 6

### **Issue: "Permission denied" errors**
**Solution:** Make sure you're using `sudo` for system-level operations

### **Issue: "Database connection failed"**
**Solution:** 
1. Check if PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify database exists: `sudo -u postgres psql -l`
3. Test connection: `psql -h localhost -U foodtruck_user -d food_truck_marketplace`

## 📊 **Verification Checklist**

- [ ] PostgreSQL installed and running
- [ ] Database `food_truck_marketplace` created
- [ ] User `foodtruck_user` created with proper permissions
- [ ] `.env.local` file created with DATABASE_URL
- [ ] Prisma client generated
- [ ] Database schema pushed
- [ ] Existing data migrated (if applicable)
- [ ] PM2 log directory created with proper permissions
- [ ] Application built successfully
- [ ] PM2 started the application
- [ ] API endpoints responding
- [ ] Image upload working

## 🎉 **Success!**

Once all steps are completed, your Food Truck Marketplace should be running with:

- ✅ **PostgreSQL database** storing all data permanently
- ✅ **Image upload functionality** working correctly
- ✅ **Images displaying** on the marketplace
- ✅ **PM2 process management** handling the application
- ✅ **Production-ready setup** for your VPS

Your images will now be permanently stored and displayed correctly! 🎉
