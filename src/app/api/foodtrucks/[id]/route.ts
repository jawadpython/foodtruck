import { NextRequest, NextResponse } from 'next/server';
import { FoodTruckService } from '@/lib/services/foodTruckService';
import { testDatabaseConnection } from '@/lib/database';

// GET /api/foodtrucks/[id] - Get a specific food truck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching food truck with ID:', id);
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const truck = await FoodTruckService.getFoodTruckById(id);
    console.log('Food truck found:', truck ? 'Yes' : 'No');
    
    if (!truck) {
      return NextResponse.json(
        { success: false, error: 'Food truck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: truck });
  } catch (error) {
    console.error('Error fetching food truck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch food truck' },
      { status: 500 }
    );
  }
}

// PUT /api/foodtrucks/[id] - Update a specific food truck
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const updatedTruck = await FoodTruckService.updateFoodTruck(id, {
      name: body.name,
      description: body.description,
      shortDescription: body.shortDescription || body.description,
      category: body.category,
      specifications: body.specifications || {
        dimensions: '',
        capacity: '',
        equipment: [],
        features: []
      },
      images: body.images || [],
      equipment: body.equipment || [],
      features: body.features || [],
      featured: body.featured || body.isFeatured || false,
    });
    return NextResponse.json({ success: true, data: updatedTruck });
  } catch (error) {
    console.error('Error updating food truck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update food truck' },
      { status: 500 }
    );
  }
}

// DELETE /api/foodtrucks/[id] - Delete a specific food truck
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const truck = await FoodTruckService.getFoodTruckById(id);
    
    if (!truck) {
      return NextResponse.json(
        { success: false, error: 'Food truck not found' },
        { status: 404 }
      );
    }

    await FoodTruckService.deleteFoodTruck(id);
    return NextResponse.json({ success: true, message: 'Food truck deleted successfully' });
  } catch (error) {
    console.error('Error deleting food truck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete food truck' },
      { status: 500 }
    );
  }
}
