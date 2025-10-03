import { prisma } from '@/lib/database';
import { FoodTruck } from '@/types';

export class FoodTruckService {
  // Get all food trucks with images
  static async getAllFoodTrucks(): Promise<FoodTruck[]> {
    try {
      const trucks = await prisma.foodTruck.findMany({
        include: {
          images: true,
          specifications: true,
          equipment: true,
          features: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return trucks.map(this.mapToFoodTruck);
    } catch (error) {
      console.error('Error fetching food trucks:', error);
      throw new Error('Failed to fetch food trucks');
    }
  }

  // Get food truck by ID
  static async getFoodTruckById(id: string): Promise<FoodTruck | null> {
    try {
      const truck = await prisma.foodTruck.findUnique({
        where: { id },
        include: {
          images: true,
          specifications: true,
          equipment: true,
          features: true,
        },
      });

      return truck ? this.mapToFoodTruck(truck) : null;
    } catch (error) {
      console.error('Error fetching food truck:', error);
      throw new Error('Failed to fetch food truck');
    }
  }

  // Create new food truck
  static async createFoodTruck(data: Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>): Promise<FoodTruck> {
    try {
      const truck = await prisma.foodTruck.create({
        data: {
          name: data.name,
          description: data.description,
          shortDescription: data.shortDescription,
          category: data.category,
          featured: data.featured,
          images: {
            create: data.images?.map(imageUrl => ({
              fileName: this.extractFileName(imageUrl),
              originalName: this.extractFileName(imageUrl),
              filePath: imageUrl,
              url: imageUrl,
              mimeType: this.getMimeTypeFromUrl(imageUrl),
              fileSize: 0, // Will be updated when file is actually uploaded
            })) || [],
          },
          specifications: data.specifications ? {
            create: {
              dimensions: data.specifications.dimensions,
              capacity: data.specifications.capacity,
            },
          } : undefined,
          equipment: data.equipment ? {
            create: data.equipment.map(item => ({
              name: item,
              description: '',
            })),
          } : undefined,
          features: data.features ? {
            create: data.features.map(feature => ({
              name: feature,
              description: '',
            })),
          } : undefined,
        },
        include: {
          images: true,
          specifications: true,
          equipment: true,
          features: true,
        },
      });

      return this.mapToFoodTruck(truck);
    } catch (error) {
      console.error('Error creating food truck:', error);
      throw new Error('Failed to create food truck');
    }
  }

  // Update food truck
  static async updateFoodTruck(id: string, data: Partial<Omit<FoodTruck, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FoodTruck> {
    try {
      const truck = await prisma.foodTruck.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          shortDescription: data.shortDescription,
          category: data.category,
          featured: data.featured,
          // Update images if provided
          ...(data.images && {
            images: {
              deleteMany: {}, // Remove existing images
              create: data.images.map(imageUrl => ({
                fileName: this.extractFileName(imageUrl),
                originalName: this.extractFileName(imageUrl),
                filePath: imageUrl,
                url: imageUrl,
                mimeType: this.getMimeTypeFromUrl(imageUrl),
                fileSize: 0,
              })),
            },
          }),
        },
        include: {
          images: true,
          specifications: true,
          equipment: true,
          features: true,
        },
      });

      return this.mapToFoodTruck(truck);
    } catch (error) {
      console.error('Error updating food truck:', error);
      throw new Error('Failed to update food truck');
    }
  }

  // Delete food truck
  static async deleteFoodTruck(id: string): Promise<void> {
    try {
      await prisma.foodTruck.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting food truck:', error);
      throw new Error('Failed to delete food truck');
    }
  }

  // Add image to food truck
  static async addImageToFoodTruck(foodTruckId: string, imageData: {
    fileName: string;
    originalName: string;
    filePath: string;
    url: string;
    mimeType: string;
    fileSize: number;
  }): Promise<void> {
    try {
      await prisma.image.create({
        data: {
          ...imageData,
          foodTruckId,
        },
      });
    } catch (error) {
      console.error('Error adding image to food truck:', error);
      throw new Error('Failed to add image to food truck');
    }
  }

  // Remove image from food truck
  static async removeImageFromFoodTruck(imageId: string): Promise<void> {
    try {
      await prisma.image.delete({
        where: { id: imageId },
      });
    } catch (error) {
      console.error('Error removing image from food truck:', error);
      throw new Error('Failed to remove image from food truck');
    }
  }

  // Helper methods
  private static mapToFoodTruck(truck: any): FoodTruck {
    return {
      id: truck.id,
      name: truck.name,
      description: truck.description,
      shortDescription: truck.shortDescription,
      category: truck.category,
      featured: truck.featured,
      images: truck.images?.map((img: any) => img.url) || [],
      specifications: truck.specifications ? {
        dimensions: truck.specifications.dimensions,
        capacity: truck.specifications.capacity,
        equipment: truck.equipment?.map((eq: any) => eq.name) || [],
        features: truck.features?.map((feat: any) => feat.name) || [],
      } : undefined,
      equipment: truck.equipment?.map((eq: any) => eq.name) || [],
      features: truck.features?.map((feat: any) => feat.name) || [],
      createdAt: truck.createdAt,
      updatedAt: truck.updatedAt,
    };
  }

  private static extractFileName(url: string): string {
    return url.split('/').pop() || 'unknown';
  }

  private static getMimeTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    return mimeTypes[extension || ''] || 'image/jpeg';
  }
}
