import { NextRequest, NextResponse } from 'next/server';
import { serverMessagesStorage } from '@/lib/serverStorage';

// GET /api/messages/[id] - Get a specific message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await serverMessagesStorage.getAll();
    const specificMessage = messages.find(m => m.id === params.id);
    
    if (!specificMessage) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: specificMessage });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// PUT /api/messages/[id] - Update a message status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (body.status) {
      await serverMessagesStorage.updateStatus(params.id, body.status);
    }

    return NextResponse.json({ success: true, message: 'Message updated successfully' });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}
