import { NextRequest, NextResponse } from 'next/server';
import { AIContractDrafter, DraftRequest } from '@/lib/ai-contract-drafter';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ...data } = body;

    const drafter = new AIContractDrafter();

    switch (action) {
      case 'draft': {
        const request: DraftRequest = data;
        const result = await drafter.draftContract(request);
        return NextResponse.json(result);
      }

      case 'refine': {
        const { draftId, feedback, conversationHistory } = data;
        const result = await drafter.refineDraft(draftId, feedback, conversationHistory);
        return NextResponse.json(result);
      }

      case 'variations': {
        const { draftId } = data;
        const result = await drafter.generateVariations(draftId);
        return NextResponse.json(result);
      }

      case 'recommendations': {
        const { draftId } = data;
        const result = await drafter.recommendClauses(draftId);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Drafting API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
