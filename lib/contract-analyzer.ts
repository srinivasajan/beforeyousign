// AI-powered contract analysis using Google Gemini

import { GoogleGenAI } from '@google/genai';
import {
  ContractAnalysis,
  ClauseAnalysis,
  RedFlag,
  RedFlagType,
  ClauseCategory,
} from './types';

const genAI = new GoogleGenAI({ vertexai: false, apiKey: process.env.GEMINI_API_KEY || '' });

// Define the JSON schema for structured output
const analysisSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
      description: 'A 2-3 sentence executive summary of the contract and overall risk level',
    },
    riskScore: {
      type: 'integer',
      description: 'Risk score between 0-100',
      minimum: 0,
      maximum: 100,
    },
    clauses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          originalText: { type: 'string' },
          plainLanguage: { type: 'string' },
          riskLevel: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
          },
          category: {
            type: 'string',
            enum: [
              'payment',
              'termination',
              'liability',
              'intellectual_property',
              'confidentiality',
              'dispute_resolution',
              'warranties',
              'indemnification',
              'non_compete',
              'general',
              'other',
            ],
          },
          concerns: {
            type: 'array',
            items: { type: 'string' },
          },
          position: {
            type: 'object',
            properties: {
              start: { type: 'integer' },
              end: { type: 'integer' },
            },
            required: ['start', 'end'],
          },
          industryComparison: {
            type: 'object',
            properties: {
              averageStrictness: {
                type: 'integer',
                description: 'How strict this clause is (0-100, 50 is average)',
                minimum: 0,
                maximum: 100,
              },
              percentile: {
                type: 'integer',
                description: 'Percentile rank (0-100)',
                minimum: 0,
                maximum: 100,
              },
              commonAlternatives: {
                type: 'array',
                items: { type: 'string' },
                description: '2-3 examples of fairer wording',
              },
              fairerVersion: {
                type: 'string',
                description: 'Suggested balanced alternative wording',
              },
            },
          },
        },
        required: [
          'id',
          'title',
          'originalText',
          'plainLanguage',
          'riskLevel',
          'category',
          'concerns',
          'position',
        ],
      },
    },
    redFlags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: {
            type: 'string',
            enum: [
              'ip_transfer',
              'unlimited_liability',
              'auto_renewal',
              'restricted_termination',
              'one_sided_amendment',
              'venue_forum',
              'waiver_of_rights',
              'confidentiality_overreach',
              'indemnification',
              'non_compete',
              'payment_terms',
              'dispute_resolution',
              'other',
            ],
          },
          severity: {
            type: 'string',
            enum: ['warning', 'danger', 'critical'],
          },
          title: { type: 'string' },
          description: { type: 'string' },
          affectedClauses: {
            type: 'array',
            items: { type: 'string' },
          },
          recommendation: { type: 'string' },
        },
        required: [
          'id',
          'type',
          'severity',
          'title',
          'description',
          'affectedClauses',
          'recommendation',
        ],
      },
    },
    recommendations: {
      type: 'array',
      items: { type: 'string' },
    },
    metadata: {
      type: 'object',
      properties: {
        documentType: { type: ['string', 'null'] },
        parties: {
          type: ['array', 'null'],
          items: { type: 'string' },
        },
        effectiveDate: { type: ['string', 'null'] },
        expirationDate: { type: ['string', 'null'] },
      },
    },
  },
  required: ['summary', 'riskScore', 'clauses', 'redFlags', 'recommendations', 'metadata'],
};

export class ContractAnalyzer {
  /**
   * Analyze contract text using AI
   */
  static async analyze(
    contractText: string,
    fileName: string,
    fileSize: number
  ): Promise<ContractAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(contractText);
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: analysisSchema,
          temperature: 0.3,
        },
      });

      const text = response.text;
      
      if (!text) {
        throw new Error('No response from AI');
      }

      const analysisData = JSON.parse(text);
      
      return this.formatAnalysis(analysisData, fileName, fileSize);
    } catch (error) {
      console.error('Contract analysis error:', error);
      throw new Error(
        `Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  private static buildAnalysisPrompt(contractText: string): string {
    return `You are an expert contract lawyer specializing in identifying risks, unfair terms, and hidden dangers in legal agreements. Your goal is to help ordinary people understand contracts written in complex legal language. Be thorough, precise, and focus on protecting the weaker party's interests.

Analyze the following contract and provide a comprehensive risk assessment with industry benchmarking. Focus on identifying terms that disadvantage the weaker party (typically the individual, freelancer, employee, or small business).

CONTRACT TEXT:
${contractText}

IMPORTANT INSTRUCTIONS:
- Identify ALL potentially harmful clauses
- Pay special attention to: IP transfers, liability caps/waivers, auto-renewals, termination restrictions, indemnification, non-compete, payment terms, dispute resolution (especially forced arbitration), venue selection, amendment rights
- Explain legal jargon in plain language that a 12-year-old could understand
- Be specific about WHY something is risky
- Provide actionable recommendations
- Give accurate character positions for each clause in the contract text
- Calculate a risk score between 0-100 based on the severity and number of problematic clauses

INDUSTRY BENCHMARKING:
For each significant clause, provide an industryComparison with:
- averageStrictness: How strict this clause is (0-100, where 50 is industry average)
- percentile: Where this falls compared to similar contracts (0-100)
- commonAlternatives: 2-3 examples of fairer wording used in similar contracts
- fairerVersion: Your suggested balanced alternative wording

Example: If a termination clause requires 90 days notice when industry average is 30 days, note:
- averageStrictness: 75 (3x stricter than average)
- percentile: 85 (stricter than 85% of similar contracts)
- Include alternatives like "30 days written notice by either party"`;
  }

  /**
   * Format AI response into ContractAnalysis type
   */
  private static formatAnalysis(
    data: any,
    fileName: string,
    fileSize: number
  ): ContractAnalysis {
    return {
      summary: data.summary || 'No summary available',
      riskScore: Math.min(100, Math.max(0, data.riskScore || 0)),
      clauses: (data.clauses || []).map((clause: any, index: number) => ({
        id: clause.id || `clause_${index}`,
        title: clause.title || 'Unnamed Clause',
        originalText: clause.originalText || '',
        plainLanguage: clause.plainLanguage || '',
        riskLevel: clause.riskLevel || 'low',
        category: clause.category || 'other',
        concerns: clause.concerns || [],
        position: clause.position || { start: 0, end: 0 },
        industryComparison: clause.industryComparison || undefined,
      })) as ClauseAnalysis[],
      redFlags: (data.redFlags || []).map((flag: any, index: number) => ({
        id: flag.id || `flag_${index}`,
        type: flag.type || 'other',
        severity: flag.severity || 'warning',
        title: flag.title || 'Unnamed Risk',
        description: flag.description || '',
        affectedClauses: flag.affectedClauses || [],
        recommendation: flag.recommendation || '',
      })) as RedFlag[],
      recommendations: data.recommendations || [],
      metadata: {
        fileName,
        fileSize,
        uploadedAt: new Date().toISOString(),
        documentType: data.metadata?.documentType,
        parties: data.metadata?.parties,
        effectiveDate: data.metadata?.effectiveDate,
        expirationDate: data.metadata?.expirationDate,
      },
    };
  }
}
