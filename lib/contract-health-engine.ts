/**
 * Contract Health Scoring Engine
 * Analyzes overall contract quality with comprehensive health metrics
 * Provides actionable recommendations for improvement
 */

interface HealthScore {
  overall: number; // 0-100
  breakdown: {
    legal: number;
    commercial: number;
    compliance: number;
    operational: number;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  concerns: HealthConcern[];
  strengths: string[];
  recommendations: Recommendation[];
  trending: 'improving' | 'stable' | 'declining';
}

interface HealthConcern {
  category: 'legal' | 'commercial' | 'compliance' | 'operational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  impact: string;
  location: string;
}

interface Recommendation {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  action: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
}

class ContractHealthEngine {
  async analyzeHealth(contract: string): Promise<HealthScore> {
    const scores = {
      legal: this.analyzeLegalHealth(contract),
      commercial: this.analyzeCommercialHealth(contract),
      compliance: this.analyzeComplianceHealth(contract),
      operational: this.analyzeOperationalHealth(contract),
    };

    const overall = Math.round(
      (scores.legal + scores.commercial + scores.compliance + scores.operational) / 4
    );

    return {
      overall,
      breakdown: scores,
      grade: this.getGrade(overall),
      concerns: this.identifyConcerns(contract, scores),
      strengths: this.identifyStrengths(contract, scores),
      recommendations: this.generateRecommendations(contract, scores),
      trending: this.analyzeTrend(overall),
    };
  }

  private analyzeLegalHealth(contract: string): number {
    let score = 100;
    const text = contract.toLowerCase();

    // Penalty for missing key clauses
    if (!text.includes('indemnif')) score -= 15;
    if (!text.includes('liability') && !text.includes('liabilities')) score -= 15;
    if (!text.includes('termination')) score -= 10;
    if (!text.includes('confidential')) score -= 10;

    // Penalty for risky terms
    if (text.includes('unlimited liability')) score -= 20;
    if (text.includes('sole discretion') && !text.includes('mutual')) score -= 10;

    return Math.max(0, score);
  }

  private analyzeCommercialHealth(contract: string): number {
    let score = 100;
    const text = contract.toLowerCase();

    // Payment terms clarity
    if (!text.includes('payment')) score -= 20;
    if (!text.includes('price') && !text.includes('fee')) score -= 15;

    // Performance metrics
    if (!text.includes('deliverable') && !text.includes('milestone')) score -= 10;
    if (!text.includes('sla') && !text.includes('service level')) score -= 10;

    return Math.max(0, score);
  }

  private analyzeComplianceHealth(contract: string): number {
    let score = 100;
    const text = contract.toLowerCase();

    // Regulatory compliance
    if (!text.includes('gdpr') && !text.includes('data protection')) score -= 10;
    if (!text.includes('governing law')) score -= 15;
    if (!text.includes('jurisdiction')) score -= 10;

    return Math.max(0, score);
  }

  private analyzeOperationalHealth(contract: string): number {
    let score = 100;
    const text = contract.toLowerCase();

    // Clarity and structure
    if (contract.length < 500) score -= 15;
    if (!text.includes('shall') && !text.includes('will')) score -= 10;

    // Change management
    if (!text.includes('amendment') && !text.includes('modification')) score -= 10;

    return Math.max(0, score);
  }

  private getGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  private identifyConcerns(contract: string, scores: any): HealthConcern[] {
    const concerns: HealthConcern[] = [];
    const text = contract.toLowerCase();

    if (scores.legal < 70) {
      concerns.push({
        category: 'legal',
        severity: 'high',
        issue: 'Missing critical legal protections',
        impact: 'Increased liability exposure and enforcement risks',
        location: 'General contract structure',
      });
    }

    if (text.includes('unlimited liability')) {
      concerns.push({
        category: 'legal',
        severity: 'critical',
        issue: 'Unlimited liability clause detected',
        impact: 'Unlimited financial exposure in case of breach',
        location: 'Liability section',
      });
    }

    if (scores.commercial < 70) {
      concerns.push({
        category: 'commercial',
        severity: 'medium',
        issue: 'Unclear commercial terms',
        impact: 'Potential payment disputes and unclear obligations',
        location: 'Payment and deliverables sections',
      });
    }

    if (!text.includes('gdpr') && !text.includes('data protection')) {
      concerns.push({
        category: 'compliance',
        severity: 'high',
        issue: 'Missing data protection provisions',
        impact: 'Regulatory compliance risks',
        location: 'Data handling sections',
      });
    }

    return concerns;
  }

  private identifyStrengths(contract: string, scores: any): string[] {
    const strengths: string[] = [];
    const text = contract.toLowerCase();

    if (scores.legal >= 85) {
      strengths.push('Strong legal protections with comprehensive clauses');
    }

    if (text.includes('limitation of liability') || text.includes('liability cap')) {
      strengths.push('Liability properly limited and capped');
    }

    if (text.includes('sla') || text.includes('service level')) {
      strengths.push('Clear performance metrics with SLA commitments');
    }

    if (scores.compliance >= 85) {
      strengths.push('Excellent regulatory compliance coverage');
    }

    if (text.includes('mutual') && text.includes('termination')) {
      strengths.push('Balanced termination rights for both parties');
    }

    return strengths;
  }

  private generateRecommendations(contract: string, scores: any): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (scores.legal < 80) {
      recommendations.push({
        priority: 'high',
        action: 'Add comprehensive indemnification clause',
        benefit: 'Protect against third-party claims and losses',
        effort: 'medium',
      });
    }

    if (scores.commercial < 80) {
      recommendations.push({
        priority: 'high',
        action: 'Define clear payment terms with milestones',
        benefit: 'Reduce payment disputes and improve cash flow',
        effort: 'low',
      });
    }

    if (scores.compliance < 70) {
      recommendations.push({
        priority: 'immediate',
        action: 'Add GDPR and data protection provisions',
        benefit: 'Ensure regulatory compliance and avoid penalties',
        effort: 'medium',
      });
    }

    recommendations.push({
      priority: 'medium',
      action: 'Include dispute resolution and arbitration clause',
      benefit: 'Faster and cheaper conflict resolution',
      effort: 'low',
    });

    return recommendations;
  }

  private analyzeTrend(score: number): 'improving' | 'stable' | 'declining' {
    // Simulate trend analysis based on score
    if (score >= 85) return 'stable';
    if (score >= 70) return 'improving';
    return 'declining';
  }
}

export const contractHealthEngine = new ContractHealthEngine();
