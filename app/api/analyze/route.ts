// API route for analyzing contracts

import { NextRequest, NextResponse } from 'next/server';
import { DocumentParser } from '@/lib/document-parser';
import { ContractAnalyzer } from '@/lib/contract-analyzer';
import { AnalysisResponse } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!DocumentParser.validateFileType(file)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload PDF, DOCX, or TXT files.',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB default)
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
    if (!DocumentParser.validateFileSize(file, maxSize)) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Parse document
    const contractText = await DocumentParser.parse(file);

    if (!contractText || contractText.trim().length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contract text is too short or could not be extracted',
        },
        { status: 400 }
      );
    }

    // Analyze contract
    const analysis = await ContractAnalyzer.analyze(
      contractText,
      file.name,
      file.size
    );

    const response: AnalysisResponse = {
      success: true,
      analysis,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze contract',
      },
      { status: 500 }
    );
  }
}
