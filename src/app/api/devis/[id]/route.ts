import { NextRequest, NextResponse } from 'next/server';
import { serverDevisStorage } from '@/lib/serverStorage';

// GET /api/devis/[id] - Get a specific quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const devis = await serverDevisStorage.getAll();
    const specificDevis = devis.find(d => d.id === params.id);
    
    if (!specificDevis) {
      return NextResponse.json(
        { success: false, error: 'Devis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: specificDevis });
  } catch (error) {
    console.error('Error fetching devis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch devis' },
      { status: 500 }
    );
  }
}

// PUT /api/devis/[id] - Update a quote
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    await serverDevisStorage.update(params.id, body);

    return NextResponse.json({ success: true, message: 'Devis updated successfully' });
  } catch (error) {
    console.error('Error updating devis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update devis' },
      { status: 500 }
    );
  }
}
