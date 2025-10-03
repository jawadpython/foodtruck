#!/usr/bin/env node

/**
 * Data migration script to move existing food truck data from JSON to PostgreSQL
 * This script reads the existing data/foodtrucks.json file and migrates it to the database
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');

    // Read existing JSON data
    const dataPath = path.join(process.cwd(), 'data', 'foodtrucks.json');
    
    if (!fs.existsSync(dataPath)) {
      console.log('❌ No existing data file found at:', dataPath);
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`📊 Found ${jsonData.length} food trucks to migrate`);

    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log('🧹 Clearing existing database data...');
    await prisma.feature.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.specification.deleteMany();
    await prisma.image.deleteMany();
    await prisma.foodTruck.deleteMany();

    // Migrate each food truck
    for (const truckData of jsonData) {
      console.log(`📦 Migrating: ${truckData.name}`);

      // Create food truck
      const truck = await prisma.foodTruck.create({
        data: {
          name: truckData.name,
          description: truckData.description,
          shortDescription: truckData.shortDescription || truckData.description,
          category: truckData.category,
          featured: truckData.featured || truckData.isFeatured || false,
        },
      });

      // Create images
      if (truckData.images && truckData.images.length > 0) {
        for (const imageUrl of truckData.images) {
          await prisma.image.create({
            data: {
              fileName: extractFileName(imageUrl),
              originalName: extractFileName(imageUrl),
              filePath: imageUrl,
              url: imageUrl,
              mimeType: getMimeTypeFromUrl(imageUrl),
              fileSize: 0, // Unknown size for existing images
              foodTruckId: truck.id,
            },
          });
        }
      }

      // Create specifications
      if (truckData.specifications) {
        await prisma.specification.create({
          data: {
            dimensions: truckData.specifications.dimensions || '',
            capacity: truckData.specifications.capacity || '',
            foodTruckId: truck.id,
          },
        });
      }

      // Create equipment
      if (truckData.equipment && truckData.equipment.length > 0) {
        for (const equipmentName of truckData.equipment) {
          await prisma.equipment.create({
            data: {
              name: equipmentName,
              description: '',
              foodTruckId: truck.id,
            },
          });
        }
      }

      // Create features
      if (truckData.features && truckData.features.length > 0) {
        for (const featureName of truckData.features) {
          await prisma.feature.create({
            data: {
              name: featureName,
              description: '',
              foodTruckId: truck.id,
            },
          });
        }
      }

      console.log(`✅ Migrated: ${truckData.name}`);
    }

    console.log('🎉 Data migration completed successfully!');
    
    // Display summary
    const totalTrucks = await prisma.foodTruck.count();
    const totalImages = await prisma.image.count();
    const totalEquipment = await prisma.equipment.count();
    const totalFeatures = await prisma.feature.count();

    console.log('\n📊 Migration Summary:');
    console.log(`• Food Trucks: ${totalTrucks}`);
    console.log(`• Images: ${totalImages}`);
    console.log(`• Equipment: ${totalEquipment}`);
    console.log(`• Features: ${totalFeatures}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function extractFileName(url) {
  return url.split('/').pop() || 'unknown';
}

function getMimeTypeFromUrl(url) {
  const extension = url.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  };
  return mimeTypes[extension || ''] || 'image/jpeg';
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };
