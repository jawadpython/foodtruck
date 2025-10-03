import { NextRequest, NextResponse } from 'next/server';
import { serverFoodTruckStorage } from '@/lib/serverStorage';

// GET /api/foodtrucks - Get all food trucks
export async function GET() {
  try {
    console.log('Fetching food trucks...');
    const trucks = await serverFoodTruckStorage.getAll();
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

    const newTruck = await serverFoodTruckStorage.create({
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
