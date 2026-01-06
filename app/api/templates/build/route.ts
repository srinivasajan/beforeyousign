import { NextRequest, NextResponse } from 'next/server';
import { SmartTemplateBuilder, TemplateBuilder } from '@/lib/smart-template-builder';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, template, ...data } = body;

    const builder = new SmartTemplateBuilder();

    switch (action) {
      case 'recommendations': {
        const result = await builder.getRecommendations(
          template.sections,
          template.contractType,
          template.industry
        );
        return NextResponse.json(result);
      }

      case 'incompatibilities': {
        const clauseIds = data.clauseIds || [];
        const result = builder.detectIncompatibilities(clauseIds);
        return NextResponse.json(result);
      }

      case 'completeness': {
        const result = builder.calculateCompleteness(template);
        return NextResponse.json(result);
      }

      case 'compile': {
        const variables = data.variables || {};
        const result = await builder.compileTemplate(template, variables);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Template builder API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
