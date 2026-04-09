// Streaming API route for analyzing contracts via Server-Sent Events

import { NextRequest } from 'next/server';
import { DocumentParser } from '@/lib/document-parser';
import { ContractAnalyzer } from '@/lib/contract-analyzer';
import { validateContractFile, sanitizeInput } from '@/lib/security';
import { createNvidiaClient, NVIDIA_MODELS, parseJsonResponse } from '@/lib/nvidia-client';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller may already be closed
        }
      };

      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const jurisdiction = sanitizeInput((formData.get('jurisdiction') as string) || 'US');

        if (!file) {
          send({ type: 'error', error: 'No file provided', requestId });
          controller.close();
          return;
        }

        const validation = validateContractFile(file);
        if (!validation.valid) {
          send({ type: 'error', error: (validation.errors || []).join(', ') || 'File validation failed', requestId });
          controller.close();
          return;
        }

        if (!DocumentParser.validateFileType(file)) {
          send({ type: 'error', error: 'Invalid file type. Please upload PDF, DOCX, or TXT files.', requestId });
          controller.close();
          return;
        }

        const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
        if (!DocumentParser.validateFileSize(file, maxSize)) {
          send({ type: 'error', error: `File size exceeds the maximum allowed size of ${maxSize / 1024 / 1024}MB`, requestId });
          controller.close();
          return;
        }

        // Step 1: Parse document
        send({ type: 'status', message: 'Parsing document...' });
        const contractText = await DocumentParser.parse(file);

        if (!contractText || contractText.trim().length < 100) {
          send({ type: 'error', error: 'Contract text is too short or could not be extracted', requestId });
          controller.close();
          return;
        }

        // Step 2: Build prompt
        send({ type: 'status', message: 'Connecting to AI...' });
        const maxPromptChars = parseInt(process.env.ANALYZE_MAX_PROMPT_CHARS || '6000');
        const maxTokens = parseInt(process.env.ANALYZE_MAX_OUTPUT_TOKENS || '2000');
        const trimmedText = contractText.length > maxPromptChars
          ? contractText.slice(0, maxPromptChars) + '\n\n[Contract text truncated for faster analysis]'
          : contractText;
        const prompt = ContractAnalyzer.buildAnalysisPrompt(trimmedText, jurisdiction);

        // Step 3: Stream response from NVIDIA NIM
        send({ type: 'status', message: 'AI is analyzing your contract...' });
        const client = createNvidiaClient();
        const nvStream = await client.chat.completions.create({
          model: NVIDIA_MODELS.fast,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: maxTokens,
          stream: true,
        });

        let fullText = '';
        for await (const chunk of nvStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullText += content;
            send({ type: 'chunk', content });
          }
        }

        // Step 4: Parse full JSON and send structured analysis
        send({ type: 'status', message: 'Finalizing analysis...' });
        const analysisData = parseJsonResponse<Record<string, unknown>>(fullText);
        const analysis = ContractAnalyzer.formatAnalysis(analysisData, file.name, file.size);
        send({ type: 'done', analysis, requestId });
        controller.close();

      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to analyze contract';
        send({ type: 'error', error: message, requestId });
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Request-Id': requestId,
    },
  });
}
