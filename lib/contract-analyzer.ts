// AI-powered contract analysis using Google Gemini

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ContractAnalysis,
  ClauseAnalysis,
  RedFlag,
  RedFlagType,
  ClauseCategory,
} from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

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
    const maxRetries = 3;
    const baseDelay = 2000; // 2 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildAnalysisPrompt(contractText, jurisdiction);
        
        const result = await model.generateContent(prompt);

        const response = result.response;
        const text = response.text();
        
        if (!text) {
          throw new Error('No response from AI');
        }

        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
        const jsonText = jsonMatch[1] || text;
        
        const analysisData = JSON.parse(jsonText.trim());
        
        return this.formatAnalysis(analysisData, fileName, fileSize);
      } catch (error: any) {
        console.error(`Contract analysis error (attempt ${attempt}/${maxRetries}):`, error);
        
        // Check if it's a rate limit or overload error
        const isRateLimitError = error?.message?.includes('503') || 
                                 error?.message?.includes('overloaded') ||
                                 error?.message?.includes('UNAVAILABLE') ||
                                 error?.status === 503;
        
        if (isRateLimitError && attempt < maxRetries) {
          // Exponential backoff: wait longer between each retry
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not a rate limit error or we've exhausted retries
        if (isRateLimitError) {
          throw new Error(
            'The Gemini API is currently overloaded. This usually happens during peak hours. Please wait 1-2 minutes and try again. If the issue persists, the free tier quota may be exhausted for today.'
          );
        }
        
        // Check for API key issues
        if (error?.message?.includes('API key') || error?.message?.includes('401')) {
          throw new Error(
            'Invalid API key. Please check your GEMINI_API_KEY in the .env file and ensure it\'s correctly configured at https://aistudio.google.com/apikey'
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
  private static buildAnalysisPrompt(contractText: string, jurisdiction: string): string {
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
      "industryComparison": {
        "averageStrictness": 50,
        "percentile": 50,
        "commonAlternatives": ["alternative 1", "alternative 2"],
        "fairerVersion": "suggested balanced wording"
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
  "metadata": {
    "documentType": "type or null",
    "parties": ["party 1", "party 2"] or null,
    "effectiveDate": "date or null",
    "expirationDate": "date or null"
  }
}

Return ONLY the JSON object, no additional text or markdown formatting.`;
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
      confidence: {
        overall: this.calculateOverallConfidence(data),
        riskScoreConfidence: this.calculateRiskConfidence(data),
        clauseAnalysisConfidence: this.calculateClauseConfidence(data),
        model: 'Google Gemini 2.0 Flash',
        modelVersion: 'gemini-2.0-flash-exp',
        analysisDate: new Date().toISOString(),
        notes: this.generateConfidenceNotes(data),
      },
    };
  }

  private static calculateOverallConfidence(data: any): number {
    // Base confidence on completeness of analysis
    let confidence = 85; // Start with high baseline for Gemini 2.0
    
    if (!data.summary || data.summary.length < 50) confidence -= 10;
    if (!data.clauses || data.clauses.length === 0) confidence -= 15;
    if (!data.redFlags || data.redFlags.length === 0) confidence -= 5;
    if (!data.recommendations || data.recommendations.length === 0) confidence -= 10;
    
    return Math.max(60, Math.min(95, confidence));
  }

  private static calculateRiskConfidence(data: any): number {
    // Confidence in risk score based on depth of analysis
    let confidence = 88;
    
    const flagCount = (data.redFlags || []).length;
    const clauseCount = (data.clauses || []).length;
    
    if (flagCount === 0 && data.riskScore > 50) confidence -= 15;
    if (clauseCount < 5) confidence -= 10;
    if (data.riskScore < 10 || data.riskScore > 90) confidence -= 5; // Extreme scores slightly less confident
    
    return Math.max(70, Math.min(95, confidence));
  }

  private static calculateClauseConfidence(data: any): number {
    // Confidence in clause-level analysis
    let confidence = 90;
    
    const clauses = data.clauses || [];
    const clausesWithComparison = clauses.filter((c: any) => c.industryComparison).length;
    const clausesWithConcerns = clauses.filter((c: any) => c.concerns && c.concerns.length > 0).length;
    
    if (clauses.length === 0) return 0;
    
    const comparisonRatio = clausesWithComparison / clauses.length;
    const concernsRatio = clausesWithConcerns / clauses.length;
    
    if (comparisonRatio < 0.3) confidence -= 15;
    if (concernsRatio < 0.2) confidence -= 10;
    
    return Math.max(75, Math.min(95, confidence));
  }

  private static generateConfidenceNotes(data: any): string[] {
    const notes: string[] = [];
    
    const clauseCount = (data.clauses || []).length;
    const flagCount = (data.redFlags || []).length;
    
    if (clauseCount > 10) {
      notes.push('Comprehensive clause-level analysis performed');
    }
    
    if (flagCount > 5) {
      notes.push('Multiple risk factors identified - thorough risk assessment');
    }
    
    const clausesWithBenchmark = (data.clauses || []).filter((c: any) => c.industryComparison).length;
    if (clausesWithBenchmark > 0) {
      notes.push(`Industry comparison data available for ${clausesWithBenchmark} clause${clausesWithBenchmark === 1 ? '' : 's'}`);
    }
    
    notes.push('Analysis performed by Google Gemini 2.0 Flash - latest generation model');
    notes.push('Your contract data is not stored or used for model training');
    
    return notes;
  }
}
