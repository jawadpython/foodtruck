import { prisma } from '@/lib/database';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ImageUploadResult {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  url: string;
  mimeType: string;
  fileSize: number;
}

export class ImageService {
  // Upload image file and save metadata to database
  static async uploadImage(file: File, foodTruckId?: string): Promise<ImageUploadResult> {
    try {
      // Validate file
      this.validateFile(file);

      // Create upload directory
      const uploadDir = this.getUploadDirectory();
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      const filePath = join(uploadDir, fileName);

      // Save file to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Generate public URL
      const publicUrl = `/uploads/foodtrucks/${fileName}`;

      // Save metadata to database
      const imageRecord = await prisma.image.create({
        data: {
          fileName,
          originalName: file.name,
          filePath: publicUrl,
          url: publicUrl,
          mimeType: file.type,
          fileSize: file.size,
          foodTruckId,
        },
      });

      return {
        id: imageRecord.id,
        fileName: imageRecord.fileName,
        originalName: imageRecord.originalName,
        filePath: imageRecord.filePath,
        url: imageRecord.url,
        mimeType: imageRecord.mimeType,
        fileSize: imageRecord.fileSize,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete image file and remove from database
  static async deleteImage(imageId: string): Promise<void> {
    try {
      // Get image record
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new Error('Image not found');
      }

      // Delete file from disk
      const fullPath = join(process.cwd(), 'public', image.filePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }

      // Remove from database
      await prisma.image.delete({
        where: { id: imageId },
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all images for a food truck
  static async getImagesByFoodTruckId(foodTruckId: string) {
    try {
      return await prisma.image.findMany({
        where: { foodTruckId },
        orderBy: { uploadedAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }

  // Get all images
  static async getAllImages() {
    try {
      return await prisma.image.findMany({
        include: {
          foodTruck: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching all images:', error);
      throw new Error('Failed to fetch images');
    }
  }

  // Clean up orphaned images (images not associated with any food truck)
  static async cleanupOrphanedImages(): Promise<number> {
    try {
      const orphanedImages = await prisma.image.findMany({
        where: {
          foodTruckId: null,
        },
      });

      let deletedCount = 0;
      for (const image of orphanedImages) {
        try {
          await this.deleteImage(image.id);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete orphaned image ${image.id}:`, error);
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned images:', error);
      throw new Error('Failed to cleanup orphaned images');
    }
  }

  // Private helper methods
  private static validateFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG files are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
  }

  private static getUploadDirectory(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction 
      ? '/var/www/food-truck-marketplace/public/uploads/foodtrucks'
      : join(process.cwd(), 'public', 'uploads', 'foodtrucks');
  }

  private static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    // Handle file extension
    let fileExtension = '';
    const nameParts = originalName.split('.');
    if (nameParts.length > 1) {
      fileExtension = nameParts.pop() || '';
    }
    
    // If no extension, try to determine from MIME type
    if (!fileExtension) {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/svg+xml': 'svg'
      };
      fileExtension = mimeToExt['image/jpeg'] || 'jpg';
    }
    
    return `${timestamp}_${randomString}.${fileExtension}`;
  }
}
