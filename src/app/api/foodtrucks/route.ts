import { NextRequest, NextResponse } from 'next/server';
import { FoodTruckService } from '@/lib/services/foodTruckService';
import { testDatabaseConnection } from '@/lib/database';

// GET /api/foodtrucks - Get all food trucks
export async function GET() {
  try {
    console.log('Fetching food trucks...');
    
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const trucks = await FoodTruckService.getAllFoodTrucks();
    console.log('Food trucks fetched:', trucks.length);
    return NextResponse.json({ success: true, data: trucks });
  } catch (error) {
    console.error('Error fetching food trucks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch food trucks' },
      { status: 500 }
    );
  }
}

// POST /api/foodtrucks - Create a new food truck
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

    const newTruck = await FoodTruckService.createFoodTruck({
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

    return NextResponse.json({ success: true, data: newTruck }, { status: 201 });
  } catch (error) {
    console.error('Error creating food truck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create food truck' },
      { status: 500 }
    );
  }
}
