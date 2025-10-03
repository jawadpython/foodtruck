import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/lib/services/imageService';
import { testDatabaseConnection } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const foodTruckId = formData.get('foodTruckId') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload image using the service
    const uploadResult = await ImageService.uploadImage(file, foodTruckId || undefined);
    
    return NextResponse.json({
      success: true,
      data: {
        id: uploadResult.id,
        url: uploadResult.url,
        fileName: uploadResult.fileName,
        originalName: uploadResult.originalName,
        size: uploadResult.fileSize,
        type: uploadResult.mimeType
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    
    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'No image ID provided' },
        { status: 400 }
      );
    }

    // Delete image using the service
    await ImageService.deleteImage(imageId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
