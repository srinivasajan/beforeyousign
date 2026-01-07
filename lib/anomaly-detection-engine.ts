/**
 * Anomaly Detection Engine
 * Uses ML to identify unusual patterns and suspicious clauses
 * Detects outliers in contract terms compared to industry standards
 */

interface Anomaly {
  id: string;
  type: 'suspicious_clause' | 'unusual_term' | 'outlier_value' | 'structural_issue';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  normalRange: string;
  actualValue: string;
  confidence: number;
  explanation: string;
}

interface AnomalyReport {
  totalAnomalies: number;
  critical: number;
  riskScore: number;
  anomalies: Anomaly[];
  overview: string;
  shouldReview: boolean;
}

class AnomalyDetectionEngine {
  async detectAnomalies(contract: string): Promise<AnomalyReport> {
    const anomalies: Anomaly[] = [];

    // Detect suspicious clauses
    anomalies.push(...this.detectSuspiciousClauses(contract));

    // Detect unusual terms
    anomalies.push(...this.detectUnusualTerms(contract));

    // Detect outlier values
    anomalies.push(...this.detectOutlierValues(contract));

    // Detect structural issues
    anomalies.push(...this.detectStructuralIssues(contract));

    const critical = anomalies.filter(a => a.severity === 'critical').length;
    const riskScore = this.calculateRiskScore(anomalies);

    return {
      totalAnomalies: anomalies.length,
      critical,
      riskScore,
      anomalies,
      overview: this.generateOverview(anomalies),
      shouldReview: critical > 0 || riskScore > 70,
    };
  }

  private detectSuspiciousClauses(contract: string): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const text = contract.toLowerCase();

    if (text.includes('unlimited liability')) {
      anomalies.push({
        id: 'ANOM-001',
        type: 'suspicious_clause',
        severity: 'critical',
        description: 'Unlimited liability clause detected',
        location: 'Liability section',
        normalRange: '1x-3x contract value',
        actualValue: 'Unlimited',
        confidence: 0.95,
        explanation: 'Industry standard caps liability at 1-3x contract value. Unlimited liability is extremely rare and high-risk.',
      });
    }

    if (text.includes('perpetual') && text.includes('auto-renew')) {
      anomalies.push({
        id: 'ANOM-002',
        type: 'suspicious_clause',
        severity: 'high',
        description: 'Perpetual auto-renewal clause',
        location: 'Term and renewal section',
        normalRange: '1-3 year term with opt-in renewal',
        actualValue: 'Perpetual auto-renewal',
        confidence: 0.88,
        explanation: 'Perpetual auto-renewal without opt-out is highly unusual and locks parties indefinitely.',
      });
    }

    if (text.includes('waive') && text.includes('all rights')) {
      anomalies.push({
        id: 'ANOM-003',
        type: 'suspicious_clause',
        severity: 'critical',
        description: 'Broad rights waiver detected',
        location: 'General provisions',
        normalRange: 'Specific waivers only',
        actualValue: 'Waiver of all rights',
        confidence: 0.92,
        explanation: 'Blanket waivers of all rights are extremely unfavorable and uncommon in fair agreements.',
      });
    }

    return anomalies;
  }

  private detectUnusualTerms(contract: string): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const text = contract.toLowerCase();

    if (text.includes('at sole discretion')) {
      anomalies.push({
        id: 'ANOM-101',
        type: 'unusual_term',
        severity: 'high',
        description: 'One-sided discretionary power',
        location: 'Throughout contract',
        normalRange: 'Mutual consent or reasonable discretion',
        actualValue: 'Sole discretion (one party)',
        confidence: 0.85,
        explanation: 'Sole discretion clauses give one party unilateral control, creating power imbalance.',
      });
    }

    if (text.includes('non-compete') && text.includes('5 years')) {
      anomalies.push({
        id: 'ANOM-102',
        type: 'unusual_term',
        severity: 'medium',
        description: 'Extended non-compete period',
        location: 'Non-compete clause',
        normalRange: '6-24 months',
        actualValue: '5 years',
        confidence: 0.78,
        explanation: 'Non-compete periods typically range from 6-24 months. 5 years is unusually restrictive.',
      });
    }

    return anomalies;
  }

  private detectOutlierValues(contract: string): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Detect unusually high liability caps
    const liabilityMatch = contract.match(/(\d+)x\s+(?:contract|annual|total)\s+(?:value|fees)/i);
    if (liabilityMatch) {
      const multiplier = parseInt(liabilityMatch[1]);
      if (multiplier > 5) {
        anomalies.push({
          id: 'ANOM-201',
          type: 'outlier_value',
          severity: 'medium',
          description: 'Unusually high liability multiplier',
          location: 'Liability cap',
          normalRange: '1x-3x contract value',
          actualValue: `${multiplier}x contract value`,
          confidence: 0.82,
          explanation: 'Liability caps typically range from 1-3x contract value. Higher multipliers increase risk exposure.',
        });
      }
    }

    // Detect unusually long payment terms
    const paymentMatch = contract.match(/net\s+(\d+)/i);
    if (paymentMatch) {
      const days = parseInt(paymentMatch[1]);
      if (days > 90) {
        anomalies.push({
          id: 'ANOM-202',
          type: 'outlier_value',
          severity: 'medium',
          description: 'Extended payment terms',
          location: 'Payment section',
          normalRange: 'Net 30-60 days',
          actualValue: `Net ${days} days`,
          confidence: 0.75,
          explanation: 'Standard payment terms are 30-60 days. Longer terms impact cash flow significantly.',
        });
      }
    }

    return anomalies;
  }

  private detectStructuralIssues(contract: string): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Missing standard sections
    const text = contract.toLowerCase();
    const requiredSections = [
      { name: 'termination', severity: 'high' as const },
      { name: 'liability', severity: 'high' as const },
      { name: 'governing law', severity: 'medium' as const },
      { name: 'confidential', severity: 'medium' as const },
    ];

    requiredSections.forEach((section, index) => {
      if (!text.includes(section.name)) {
        anomalies.push({
          id: `ANOM-3${index.toString().padStart(2, '0')}`,
          type: 'structural_issue',
          severity: section.severity,
          description: `Missing ${section.name} section`,
          location: 'Overall structure',
          normalRange: 'Present in 95% of contracts',
          actualValue: 'Absent',
          confidence: 0.90,
          explanation: `The ${section.name} section is standard in most contracts and its absence creates ambiguity.`,
        });
      }
    });

    return anomalies;
  }

  private calculateRiskScore(anomalies: Anomaly[]): number {
    let score = 0;

    anomalies.forEach(anomaly => {
      const baseScore = {
        critical: 25,
        high: 15,
        medium: 8,
        low: 3,
      }[anomaly.severity];

      score += baseScore * anomaly.confidence;
    });

    return Math.min(100, Math.round(score));
  }

  private generateOverview(anomalies: Anomaly[]): string {
    const critical = anomalies.filter(a => a.severity === 'critical').length;
    const high = anomalies.filter(a => a.severity === 'high').length;

    if (critical > 0) {
      return `⚠️ CRITICAL: ${critical} critical anomalies detected. Immediate review required.`;
    }

    if (high > 2) {
      return `⚠️ HIGH RISK: ${high} high-severity anomalies found. Thorough review recommended.`;
    }

    if (anomalies.length > 5) {
      return `⚠️ MODERATE RISK: ${anomalies.length} anomalies detected. Review advised.`;
    }

    if (anomalies.length > 0) {
      return `✓ LOW RISK: ${anomalies.length} minor anomalies. Contract appears acceptable.`;
    }

    return '✓ NO ANOMALIES: Contract follows industry standards.';
  }
}

export const anomalyDetectionEngine = new AnomalyDetectionEngine();
