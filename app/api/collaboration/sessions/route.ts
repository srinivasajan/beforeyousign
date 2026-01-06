import { NextRequest, NextResponse } from 'next/server';
import { RealtimeCollaborationEngine, CollaborationOperation } from '@/lib/realtime-collaboration';
import { getServerSession } from 'next-auth';

const engine = new RealtimeCollaborationEngine();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ...data } = body;

    switch (action) {
      case 'join': {
        const { documentId, userId, userName } = data;
        const sessionData = await engine.joinSession(documentId, userId, userName);
        return NextResponse.json(sessionData);
      }

      case 'operation': {
        const { sessionId, operation } = data;
        const result = await engine.applyOperation(sessionId, operation as CollaborationOperation);
        return NextResponse.json(result);
      }

      case 'cursor': {
        const { sessionId, userId, position } = data;
        engine.updateCursor(sessionId, userId, position);
        return NextResponse.json({ success: true });
      }

      case 'comment': {
        const { sessionId, userId, comment } = data;
        const result = await engine.addComment(sessionId, userId, comment);
        return NextResponse.json(result);
      }

      case 'suggestion': {
        const { sessionId, userId, suggestion } = data;
        const result = await engine.createSuggestion(sessionId, userId, suggestion);
        return NextResponse.json(result);
      }

      case 'review-suggestion': {
        const { sessionId, suggestionId, userId, action: reviewAction } = data;
        const result = await engine.reviewSuggestion(
          sessionId,
          suggestionId,
          userId,
          reviewAction
        );
        return NextResponse.json(result);
      }

      case 'replay': {
        const { sessionId } = data;
        const replay = engine.replaySession(sessionId);
        return NextResponse.json(replay);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Collaboration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const session = engine['sessions'].get(documentId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      documentId: session.documentId,
      participants: Array.from(session.participants.values()),
      operations: session.operations.length,
      comments: session.comments.length,
      suggestions: session.suggestions.length,
    });
  } catch (error) {
    console.error('Collaboration API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
