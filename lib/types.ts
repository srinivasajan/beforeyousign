// Core types for contract analysis

export interface ContractAnalysis {
  summary: string;
  riskScore: number; // 0-100
  clauses: ClauseAnalysis[];
  redFlags: RedFlag[];
  recommendations: string[];
  metadata: ContractMetadata;
  industryBenchmark?: IndustryBenchmark;
  comparativeInsights?: ComparativeInsight[];
}

export interface ClauseAnalysis {
  id: string;
  title: string;
  originalText: string;
  plainLanguage: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: ClauseCategory;
  concerns: string[];
  position: {
    start: number;
    end: number;
  };
  industryComparison?: {
    averageStrictness: number; // 0-100, how strict this clause is compared to industry average
    percentile: number; // where this clause falls (0-100)
    commonAlternatives?: string[];
    fairerVersion?: string;
  };
}

export interface RedFlag {
  id: string;
  type: RedFlagType;
  severity: 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  affectedClauses: string[];
  recommendation: string;
}

export type RedFlagType =
  | 'ip_transfer'
  | 'unlimited_liability'
  | 'auto_renewal'
  | 'restricted_termination'
  | 'one_sided_amendment'
  | 'venue_forum'
  | 'waiver_of_rights'
  | 'confidentiality_overreach'
  | 'indemnification'
  | 'non_compete'
  | 'payment_terms'
  | 'dispute_resolution'
  | 'other';

export type ClauseCategory =
  | 'payment'
  | 'termination'
  | 'liability'
  | 'intellectual_property'
  | 'confidentiality'
  | 'dispute_resolution'
  | 'warranties'
  | 'indemnification'
  | 'non_compete'
  | 'general'
  | 'other';

export interface ContractMetadata {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  documentType?: string;
  parties?: string[];
  effectiveDate?: string;
  expirationDate?: string;
}

export interface AnalysisRequest {
  contractText: string;
  fileName: string;
  fileSize: number;
  documentType?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: ContractAnalysis;
  error?: string;
}

export interface IndustryBenchmark {
  industry: string;
  averageRiskScore: number;
  comparisonSummary: string;
  keyDifferences: {
    clause: string;
    yourContract: string;
    industryStandard: string;
    multiplier?: number; // e.g., "3x stricter"
  }[];
}

export interface ComparativeInsight {
  id: string;
  type: 'stricter' | 'fairer' | 'standard' | 'unusual';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  clauseId?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  riskScore: number;
  useCase: string;
  downloadUrl?: string;
  preview?: string;
}

export interface ClauseAlternative {
  originalClause: string;
  fairerVersion: string;
  explanation: string;
  votes: number;
  source: 'community' | 'expert' | 'legal_standard';
  contributor?: string;
}
