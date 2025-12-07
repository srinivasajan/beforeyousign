// Core types for contract analysis

export interface ContractAnalysis {
  summary: string;
  riskScore: number; // 0-100
  clauses: ClauseAnalysis[];
  redFlags: RedFlag[];
  recommendations: string[];
  metadata: ContractMetadata;
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
