// AI-powered contract analysis using NVIDIA NIM API

import { generateText, parseJsonResponse, NVIDIA_MODELS } from './nvidia-client';
import {
  ContractAnalysis,
  ClauseAnalysis,
  RedFlag,
} from './types';

export class ContractAnalyzer {
  /**
   * Analyze contract text using AI
   */
  static async analyze(
    contractText: string,
    fileName: string,
    fileSize: number,
    jurisdiction: string = 'US'
  ): Promise<ContractAnalysis> {
    const maxRetries = Math.max(1, Number.parseInt(process.env.ANALYZE_MAX_RETRIES || '1', 10));
    const baseDelay = 750;
    // Reduced defaults: smaller prompt + fewer tokens = faster inference (15-25s vs 50-90s)
    const maxPromptChars = Math.max(3000, Number.parseInt(process.env.ANALYZE_MAX_PROMPT_CHARS || '6000', 10));
    const modelOutputTokens = Math.max(512, Number.parseInt(process.env.ANALYZE_MAX_OUTPUT_TOKENS || '1024', 10));
    const trimmedContractText = contractText.length > maxPromptChars
      ? `${contractText.slice(0, maxPromptChars)}\n\n[Contract text truncated for faster analysis due to deployment limits]`
      : contractText;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildAnalysisPrompt(trimmedContractText, jurisdiction);
        
        const text = await generateText(prompt, NVIDIA_MODELS.fast, 0.3, modelOutputTokens);
        
        if (!text) {
          throw new Error('No response from AI');
        }

        const analysisData = parseJsonResponse<Record<string, unknown>>(text);
        
        return this.formatAnalysis(analysisData, fileName, fileSize);
      } catch (error: unknown) {
        console.error(`Contract analysis error (attempt ${attempt}/${maxRetries}):`, error);
        const err = error as Error & { message?: string; status?: number };
        
        // Check if it's a rate limit or overload error
        const isRateLimitError = err?.message?.includes('503') || 
                                 err?.message?.includes('429') ||
                                 err?.message?.includes('overloaded') ||
                                 err?.message?.includes('UNAVAILABLE') ||
                                 err?.status === 503 ||
                                 err?.status === 429;
        
        if (isRateLimitError && attempt < maxRetries) {
          // Exponential backoff: wait longer between each retry
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not a rate limit error or we've exhausted retries
        if (isRateLimitError) {
          throw new Error(
            'The AI service is currently busy. Please wait 1-2 minutes and try again.'
          );
        }
        
        // Check for API key issues
        if (err?.message?.includes('API key') || err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
          throw new Error(
            'Invalid API key. Please check your NVIDIA_API_KEY in the .env.local file and ensure it is correctly configured.'
          );
        }
        
        throw new Error(
          `Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
    
    throw new Error('Failed to analyze contract after 3 attempts. The API is experiencing heavy load. Please try again in a few minutes.');
  }

  /**
   * Build comprehensive analysis prompt
   */
  public static buildAnalysisPrompt(contractText: string, jurisdiction: string): string {
    // Parse jurisdiction format: "US-California" or "US" or "CA-Ontario"
    const getJurisdictionName = (code: string): string => {
      const countryNames: Record<string, string> = {
        'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico',
        'UK': 'United Kingdom', 'EU': 'European Union', 'DE': 'Germany', 'FR': 'France',
        'ES': 'Spain', 'IT': 'Italy', 'NL': 'Netherlands', 'IE': 'Ireland', 'CH': 'Switzerland',
        'BE': 'Belgium', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
        'FI': 'Finland', 'PT': 'Portugal', 'GR': 'Greece', 'PL': 'Poland', 'CZ': 'Czech Republic',
        'RO': 'Romania', 'HU': 'Hungary',
        'IN': 'India', 'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore',
        'HK': 'Hong Kong', 'TW': 'Taiwan', 'MY': 'Malaysia', 'TH': 'Thailand', 'ID': 'Indonesia',
        'PH': 'Philippines', 'VN': 'Vietnam', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'LK': 'Sri Lanka',
        'AU': 'Australia', 'NZ': 'New Zealand',
        'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'IL': 'Israel', 'TR': 'Turkey',
        'QA': 'Qatar', 'KW': 'Kuwait', 'BH': 'Bahrain', 'OM': 'Oman', 'JO': 'Jordan', 'LB': 'Lebanon',
        'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru',
        'VE': 'Venezuela', 'EC': 'Ecuador', 'UY': 'Uruguay',
        'ZA': 'South Africa', 'NG': 'Nigeria', 'EG': 'Egypt', 'KE': 'Kenya', 'MA': 'Morocco',
        'GH': 'Ghana', 'ET': 'Ethiopia', 'TZ': 'Tanzania', 'UG': 'Uganda',
        'CR': 'Costa Rica', 'PA': 'Panama', 'TT': 'Trinidad and Tobago', 'JM': 'Jamaica', 'BB': 'Barbados',
        'RU': 'Russia', 'UA': 'Ukraine',
      };
      
      if (code.includes('-')) {
        const [countryCode, stateName] = code.split('-');
        const countryName = countryNames[countryCode] || countryCode;
        return `${stateName}, ${countryName}`;
      }
      
      return countryNames[code] || code;
    };
    
    const jurisdictionName = getJurisdictionName(jurisdiction);
    return `You are an expert contract lawyer specializing in identifying risks, unfair terms, and hidden dangers in legal agreements. Your goal is to help ordinary people understand contracts written in complex legal language. Be thorough, precise, and focus on protecting the weaker party's interests.

JURISDICTION: ${jurisdictionName}
This contract will be analyzed under the laws and regulations of ${jurisdictionName}. Pay special attention to jurisdiction-specific legal requirements, protections, and restrictions that may apply.

Analyze the following contract and provide a comprehensive risk assessment with industry benchmarking. Focus on identifying terms that disadvantage the weaker party (typically the individual, freelancer, employee, or small business).

CONTRACT TEXT:
${contractText}

IMPORTANT INSTRUCTIONS:
- Identify ALL potentially harmful clauses
- Pay special attention to: IP transfers, liability caps/waivers, auto-renewals, termination restrictions, indemnification, non-compete, payment terms, dispute resolution (especially forced arbitration), venue selection, amendment rights
- Consider jurisdiction-specific laws:
  * California: Non-compete clauses are largely unenforceable
  * EU/UK: GDPR data protection requirements, stronger consumer protections
  * Australia: Unfair contract terms legislation
  * At-will employment varies by jurisdiction (standard in US, illegal in many countries)
  * Minimum notice periods, mandatory benefits, and termination protections vary significantly
- Flag clauses that may violate local laws or regulations in ${jurisdictionName}
- Explain legal jargon in plain language that a 12-year-old could understand
- Be specific about WHY something is risky IN THIS JURISDICTION
- Provide actionable recommendations that comply with ${jurisdictionName} laws
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
- Include alternatives like "30 days written notice by either party"

NEGOTIATION INTELLIGENCE:
For clauses with medium-to-critical risk, add a negotiationStrategy with:
- priority: "high|medium|low" (how important to negotiate this)
- leverage: "strong|moderate|weak" (your negotiating position on this point)
- suggestedApproach: Specific talking points or negotiation tactics
- fallbackPositions: 2-3 compromise positions if your ideal terms are rejected
- marketPrecedents: Similar contracts where this was negotiated successfully

FAIRNESS SCORING:
For each clause, calculate a fairnessScore (0-100) where:
- 0-25: Extremely one-sided, heavily favors other party
- 26-50: Somewhat unbalanced, minor improvements needed
- 51-75: Reasonably balanced, standard market terms
- 76-100: Exceptionally fair, protects both parties equally

Consider: reciprocity, reasonableness, industry norms, legal enforceability

AUTOMATED INSIGHTS:
Detect and flag:
- missingClauses: Important protections absent from this contract type
- contradictions: Clauses that conflict with each other
- unusualTerms: Atypical provisions that warrant extra scrutiny
- strengthsToKeep: Surprisingly favorable terms worth preserving

REQUIRED OUTPUT FORMAT:
Return your analysis as a JSON object with the following structure:
{
  "summary": "2-3 sentence executive summary",
  "riskScore": 0-100,
  "clauses": [
    {
      "id": "unique_id",
      "title": "Clause Title",
      "originalText": "exact text from contract",
      "plainLanguage": "simple explanation",
      "riskLevel": "low|medium|high|critical",
      "category": "payment|termination|liability|intellectual_property|confidentiality|dispute_resolution|warranties|indemnification|non_compete|general|other",
      "concerns": ["concern 1", "concern 2"],
      "position": {"start": 0, "end": 100},
      "fairnessScore": 50,
      "industryComparison": {
        "averageStrictness": 50,
        "percentile": 50,
        "commonAlternatives": ["alternative 1", "alternative 2"],
        "fairerVersion": "suggested balanced wording"
      },
      "negotiationStrategy": {
        "priority": "high|medium|low",
        "leverage": "strong|moderate|weak",
        "suggestedApproach": "specific tactics",
        "fallbackPositions": ["compromise 1", "compromise 2"],
        "marketPrecedents": ["example 1", "example 2"]
      }
    }
  ],
  "redFlags": [
    {
      "id": "flag_id",
      "type": "ip_transfer|unlimited_liability|auto_renewal|restricted_termination|one_sided_amendment|venue_forum|waiver_of_rights|confidentiality_overreach|indemnification|non_compete|payment_terms|dispute_resolution|other",
      "severity": "warning|danger|critical",
      "title": "Flag Title",
      "description": "Detailed description",
      "affectedClauses": ["clause_id_1"],
      "recommendation": "What to do about it"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "insights": {
    "missingClauses": ["clause type 1", "clause type 2"],
    "contradictions": [{"clause1": "id", "clause2": "id", "issue": "description"}],
    "unusualTerms": [{"clauseId": "id", "reason": "why unusual"}],
    "strengthsToKeep": ["favorable term 1", "favorable term 2"]
  },
  "metadata": {
    "documentType": "employment|nda|service_agreement|lease|purchase_order|partnership|licensing|consulting|freelance|vendor|subscription|master_service_agreement|sow|other or null",
    "parties": ["party 1", "party 2"] or null,
    "effectiveDate": "date or null",
    "expirationDate": "date or null",
    "governingLaw": "jurisdiction or null",
    "contractValue": "estimated value or null",
    "autoRenewal": true or false or null
  }
}

Return ONLY the JSON object, no additional text or markdown formatting.`;
  }

  /**
   * Format AI response into ContractAnalysis type
   */
  public static formatAnalysis(
    data: Record<string, unknown>,
    fileName: string,
    fileSize: number
  ): ContractAnalysis {
    return {
      summary: (data.summary as string) || 'No summary available',
      riskScore: Math.min(100, Math.max(0, (data.riskScore as number) || 0)),
      clauses: ((data.clauses as Array<Record<string, unknown>>) || []).map((clause, index: number) => ({
        id: clause.id || `clause_${index}`,
        title: clause.title || 'Unnamed Clause',
        originalText: clause.originalText || '',
        plainLanguage: clause.plainLanguage || '',
        riskLevel: clause.riskLevel || 'low',
        category: clause.category || 'other',
        concerns: clause.concerns || [],
        position: clause.position || { start: 0, end: 0 },
        fairnessScore: (clause.fairnessScore as number) || 50,
        industryComparison: clause.industryComparison || undefined,
        negotiationStrategy: clause.negotiationStrategy || undefined,
      })) as ClauseAnalysis[],
      redFlags: ((data.redFlags as Array<Record<string, unknown>>) || []).map((flag, index: number) => ({
        id: flag.id || `flag_${index}`,
        type: flag.type || 'other',
        severity: flag.severity || 'warning',
        title: flag.title || 'Unnamed Risk',
        description: flag.description || '',
        affectedClauses: flag.affectedClauses || [],
        recommendation: flag.recommendation || '',
      })) as RedFlag[],
      recommendations: (data.recommendations as string[]) || [],
      insights: {
        missingClauses: ((data.insights as Record<string, unknown>)?.missingClauses as string[]) || [],
        contradictions: (((data.insights as Record<string, unknown>)?.contradictions as Array<Record<string, unknown>>) || []).map((c: Record<string, unknown>) => ({
          clause1: (c.clause1 as string) || '',
          clause2: (c.clause2 as string) || '',
          issue: (c.issue as string) || '',
        })),
        unusualTerms: (((data.insights as Record<string, unknown>)?.unusualTerms as Array<Record<string, unknown>>) || []).map((t: Record<string, unknown>) => ({
          clauseId: (t.clauseId as string) || '',
          reason: (t.reason as string) || '',
        })),
        strengthsToKeep: ((data.insights as Record<string, unknown>)?.strengthsToKeep as string[]) || [],
      },
      metadata: {
        fileName,
        fileSize,
        uploadedAt: new Date().toISOString(),
        documentType: (data.metadata as Record<string, unknown>)?.documentType as string | undefined,
        parties: (data.metadata as Record<string, unknown>)?.parties as string[] | undefined,
        effectiveDate: (data.metadata as Record<string, unknown>)?.effectiveDate as string | undefined,
        expirationDate: (data.metadata as Record<string, unknown>)?.expirationDate as string | undefined,
        governingLaw: (data.metadata as Record<string, unknown>)?.governingLaw as string | undefined,
        contractValue: (data.metadata as Record<string, unknown>)?.contractValue as string | undefined,
        autoRenewal: (data.metadata as Record<string, unknown>)?.autoRenewal as boolean | undefined,
      },
      confidence: {
        overall: this.calculateOverallConfidence(data),
        riskScoreConfidence: this.calculateRiskConfidence(data),
        clauseAnalysisConfidence: this.calculateClauseConfidence(data),
        model: 'Llama 3.1 405B Instruct',
        modelVersion: NVIDIA_MODELS.primary,
        analysisDate: new Date().toISOString(),
        notes: this.generateConfidenceNotes(data),
      },
    };
  }

  private static calculateOverallConfidence(data: Record<string, unknown>): number {
    // Base confidence on completeness of analysis
    let confidence = 85; // Start with high baseline for Gemini 2.0
    
    if (!(data.summary as string) || (data.summary as string).length < 50) confidence -= 10;
    if (!(data.clauses as Array<unknown>) || (data.clauses as Array<unknown>).length === 0) confidence -= 15;
    if (!(data.redFlags as Array<unknown>) || (data.redFlags as Array<unknown>).length === 0) confidence -= 5;
    if (!(data.recommendations as Array<unknown>) || (data.recommendations as Array<unknown>).length === 0) confidence -= 10;
    
    return Math.max(60, Math.min(95, confidence));
  }

  private static calculateRiskConfidence(data: Record<string, unknown>): number {
    // Confidence in risk score based on depth of analysis
    let confidence = 88;
    
    const flagCount = ((data.redFlags as Array<unknown>) || []).length;
    const clauseCount = ((data.clauses as Array<unknown>) || []).length;
    const riskScore = (data.riskScore as number) || 0;
    
    if (flagCount === 0 && riskScore > 50) confidence -= 15;
    if (clauseCount < 5) confidence -= 10;
    if (riskScore < 10 || riskScore > 90) confidence -= 5; // Extreme scores slightly less confident
    
    return Math.max(70, Math.min(95, confidence));
  }

  private static calculateClauseConfidence(data: Record<string, unknown>): number {
    // Confidence in clause-level analysis
    let confidence = 90;
    
    const clauses = (data.clauses as Array<Record<string, unknown>>) || [];
    const clausesWithComparison = clauses.filter((c) => c.industryComparison).length;
    const clausesWithConcerns = clauses.filter((c) => c.concerns && Array.isArray(c.concerns) && c.concerns.length > 0).length;
    
    if (clauses.length === 0) return 0;
    
    const comparisonRatio = clausesWithComparison / clauses.length;
    const concernsRatio = clausesWithConcerns / clauses.length;
    
    if (comparisonRatio < 0.3) confidence -= 15;
    if (concernsRatio < 0.2) confidence -= 10;
    
    return Math.max(75, Math.min(95, confidence));
  }

  private static generateConfidenceNotes(data: Record<string, unknown>): string[] {
    const notes: string[] = [];
    
    const clauseCount = ((data.clauses as Array<unknown>) || []).length;
    const flagCount = ((data.redFlags as Array<unknown>) || []).length;
    
    if (clauseCount > 10) {
      notes.push('Comprehensive clause-level analysis performed');
    }
    
    if (flagCount > 5) {
      notes.push('Multiple risk factors identified - thorough risk assessment');
    }
    
    const clausesWithBenchmark = ((data.clauses as Array<Record<string, unknown>>) || []).filter((c) => c.industryComparison).length;
    if (clausesWithBenchmark > 0) {
      notes.push(`Industry comparison data available for ${clausesWithBenchmark} clause${clausesWithBenchmark === 1 ? '' : 's'}`);
    }
    
    notes.push('Analysis performed by Llama 3.1 405B Instruct - state-of-the-art reasoning model');
    notes.push('Your contract data is not stored or used for model training');
    
    return notes;
  }
}
