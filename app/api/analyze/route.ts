// API route for analyzing contracts

import { NextRequest, NextResponse } from 'next/server';
import { DocumentParser } from '@/lib/document-parser';
import { ContractAnalyzer } from '@/lib/contract-analyzer';
import { AnalysisResponse } from '@/lib/types';
import { validateContractFile, sanitizeInput } from '@/lib/security';
import { performanceMonitor } from '@/lib/performance';
import { db } from '@/lib/database';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

const PARSE_TIMEOUT_MS = Number.parseInt(process.env.ANALYZE_PARSE_TIMEOUT_MS || '12000', 10);
const ANALYSIS_TIMEOUT_MS = Number.parseInt(process.env.ANALYZE_EXECUTION_TIMEOUT_MS || '22000', 10);

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jurisdiction = sanitizeInput((formData.get('jurisdiction') as string) || 'US');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided', requestId },
        { status: 400 }
      );
    }

    // Enhanced file validation with security checks
    const validation = validateContractFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'File validation failed',
          errors: validation.errors,
          requestId,
        },
        { status: 400 }
      );
    }

    // Validate file type (additional check)
    if (!DocumentParser.validateFileType(file)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload PDF, DOCX, or TXT files.',
          requestId,
        },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
    if (!DocumentParser.validateFileSize(file, maxSize)) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
          requestId,
        },
        { status: 400 }
      );
    }

    // Parse document with performance tracking
    const contractText = await performanceMonitor.measureAsync(
      'document_parse',
      () => withTimeout(DocumentParser.parse(file), PARSE_TIMEOUT_MS, 'Document parsing'),
      { fileName: file.name, fileSize: file.size }
    );

    if (!contractText || contractText.trim().length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contract text is too short or could not be extracted',
          requestId,
        },
        { status: 400 }
      );
    }

    // Analyze contract with performance tracking
    const analysis = await performanceMonitor.measureAsync(
      'contract_analysis',
      () => withTimeout(
        ContractAnalyzer.analyze(contractText, file.name, file.size, jurisdiction),
        ANALYSIS_TIMEOUT_MS,
        'Contract analysis'
      ),
      { jurisdiction, textLength: contractText.length }
    );

    // Store analysis in database for future reference
    const analysisRecord = {
      id: crypto.randomUUID(),
      requestId,
      timestamp: Date.now(),
      fileName: file.name,
      fileSize: file.size,
      jurisdiction,
      riskLevel: analysis.riskScore > 0.7 ? 'high' : analysis.riskScore > 0.4 ? 'medium' : 'low',
      riskScore: analysis.riskScore,
      redFlagsCount: analysis.redFlags?.length || 0,
    };

    db.insert('contractAnalyses', analysisRecord);

    const response: AnalysisResponse = {
      success: true,
      analysis,
      requestId,
    };

    // Record total processing time
    const duration = performance.now() - startTime;
    performanceMonitor.record('api_analyze_total', duration, 'api', 'ms', {
      success: true,
      fileSize: file.size,
    });

    return NextResponse.json(response);
  } catch (error) {
    const duration = performance.now() - startTime;
    
    console.error('[API /analyze] Error:', error);
    
    // Record error performance
    performanceMonitor.record('api_analyze_total', duration, 'api', 'ms', {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Log error to database
    const errorLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      endpoint: '/api/analyze',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestId,
    };
    
    db.insert('apiErrors', errorLog);

    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze contract';
    const status = errorMessage.includes('timed out after') ? 504 : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          status === 504
            ? 'Analysis took too long to complete. Please try again with a smaller contract, or retry in a few minutes.'
            : errorMessage,
        requestId,
      },
      { status }
    );
  }
}
