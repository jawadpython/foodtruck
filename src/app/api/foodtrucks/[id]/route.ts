import { NextRequest, NextResponse } from 'next/server';
import { serverFoodTruckStorage } from '@/lib/serverStorage';

// GET /api/foodtrucks/[id] - Get a specific food truck
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching food truck with ID:', params.id);
    const truck = await serverFoodTruckStorage.getById(params.id);
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const updatedTruck = await serverFoodTruckStorage.update(params.id, {
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
  { params }: { params: { id: string } }
) {
  try {
    const truck = await serverFoodTruckStorage.getById(params.id);
    
    if (!truck) {
      return NextResponse.json(
        { success: false, error: 'Food truck not found' },
        { status: 404 }
      );
    }

    await serverFoodTruckStorage.delete(params.id);
    return NextResponse.json({ success: true, message: 'Food truck deleted successfully' });
  } catch (error) {
    console.error('Error deleting food truck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete food truck' },
      { status: 500 }
    );
  }
}
