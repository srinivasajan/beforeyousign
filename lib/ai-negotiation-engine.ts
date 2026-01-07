/**
 * AI Contract Negotiation Engine
 * Provides intelligent negotiation recommendations and counter-proposals
 */

export interface NegotiationContext {
  contractType: string;
  industry: string;
  yourRole: 'buyer' | 'seller' | 'employer' | 'contractor';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface NegotiationRecommendation {
  clause: string;
  action: 'accept' | 'reject' | 'counter';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  counterProposal?: string;
  marketBenchmark?: string;
}

export class AIContractNegotiationEngine {
  async analyzeClause(
    clauseText: string,
    context: NegotiationContext
  ): Promise<NegotiationRecommendation> {
    // Analyze risk level
    const riskLevel = this.assessRisk(clauseText);
    
    // Determine action
    const action = this.determineAction(riskLevel, context);
    
    // Generate counter-proposal if needed
    const counterProposal = action === 'counter' 
      ? this.generateCounterProposal(clauseText, context)
      : undefined;
    
    return {
      clause: clauseText.substring(0, 100),
      action,
      priority: this.determinePriority(riskLevel),
      reasoning: this.generateReasoning(clauseText, riskLevel, context),
      counterProposal,
      marketBenchmark: this.getMarketBenchmark(clauseText, context),
    };
  }

  private assessRisk(clauseText: string): number {
    const lowerText = clauseText.toLowerCase();
    let risk = 0;
    
    if (lowerText.includes('unlimited') || lowerText.includes('without limitation')) risk += 30;
    if (lowerText.includes('sole discretion')) risk += 20;
    if (lowerText.includes('perpetual')) risk += 15;
    
    return Math.min(risk, 100);
  }

  private determineAction(risk: number, context: NegotiationContext): 'accept' | 'reject' | 'counter' {
    if (risk > 60) return 'counter';
    if (risk > 30 && context.riskTolerance === 'conservative') return 'counter';
    if (risk < 20) return 'accept';
    return 'counter';
  }

  private determinePriority(risk: number): 'critical' | 'high' | 'medium' | 'low' {
    if (risk > 80) return 'critical';
    if (risk > 60) return 'high';
    if (risk > 30) return 'medium';
    return 'low';
  }

  private generateCounterProposal(clauseText: string, context: NegotiationContext): string {
    const lowerText = clauseText.toLowerCase();
    
    if (lowerText.includes('unlimited liability')) {
      return clauseText.replace(/unlimited liability/gi, 'liability capped at 12 months of fees paid');
    }
    
    if (lowerText.includes('sole discretion')) {
      return clauseText.replace(/sole discretion/gi, 'reasonable discretion');
    }
    
    return clauseText + ' [Suggested: Add reciprocal obligations and notice period]';
  }

  private generateReasoning(clauseText: string, risk: number, context: NegotiationContext): string {
    if (risk > 60) {
      return `This clause carries high risk exposure. Industry standard typically includes liability caps and mutual obligations. Recommend negotiating to reduce exposure.`;
    }
    
    if (risk > 30) {
      return `Moderate risk identified. Consider requesting reciprocal terms and clearer definitions to protect your interests.`;
    }
    
    return `This clause appears reasonable and aligns with market standards for ${context.contractType} agreements.`;
  }

  private getMarketBenchmark(clauseText: string, context: NegotiationContext): string {
    const lowerText = clauseText.toLowerCase();
    
    if (lowerText.includes('liability')) {
      return 'Market standard: 6-12 months of fees with carve-outs for gross negligence';
    }
    
    if (lowerText.includes('payment')) {
      return 'Market standard: Net 30-60 days depending on industry';
    }
    
    if (lowerText.includes('term') || lowerText.includes('duration')) {
      return 'Market standard: 12-month initial term with auto-renewal';
    }
    
    return 'Align with industry best practices';
  }
}

export const aiNegotiationEngine = new AIContractNegotiationEngine();
