import { NextRequest, NextResponse } from 'next/server';
import { serverDevisStorage } from '@/lib/serverStorage';

// GET /api/devis - Get all quotes
export async function GET() {
  try {
    const devis = await serverDevisStorage.getAll();
    return NextResponse.json({ success: true, data: devis });
  } catch (error) {
    console.error('Error fetching devis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch devis' },
      { status: 500 }
    );
  }
}

// POST /api/devis - Create a new quote request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'message'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newDevis = await serverDevisStorage.create({
      truckId: body.truckId || '',
      truckName: body.truckName || 'Demande générale',
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      message: body.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newDevis }, { status: 201 });
  } catch (error) {
    console.error('Error creating devis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create devis' },
      { status: 500 }
    );
  }
}
