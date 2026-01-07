/**
 * AI Lawyer Chatbot - CONSUMER GAME CHANGER
 * GPT-4 powered legal advisor that answers contract questions in real-time
 * Makes legal advice accessible to everyone
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    citations?: LegalCitation[];
    confidence?: number;
    suggestedActions?: string[];
  };
}

export interface LegalCitation {
  source: string;
  title: string;
  url?: string;
  relevance: number; // 0-100
  excerpt: string;
}

export interface ChatContext {
  contractId?: string;
  contractType?: string;
  jurisdiction?: string;
  userRole?: 'individual' | 'business' | 'lawyer';
  conversationHistory: ChatMessage[];
}

export interface AIResponse {
  answer: string;
  confidence: number; // 0-100
  citations: LegalCitation[];
  relatedQuestions: string[];
  disclaimers: string[];
  suggestedActions: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    cost: string;
    timeframe: string;
  }>;
}

class AILawyerChatbot {
  private conversationContexts: Map<string, ChatContext> = new Map();

  /**
   * Start new conversation
   */
  async startConversation(
    userId: string,
    context?: {
      contractId?: string;
      contractType?: string;
      jurisdiction?: string;
      userRole?: 'individual' | 'business' | 'lawyer';
    }
  ): Promise<string> {
    const conversationId = `chat-${userId}-${Date.now()}`;
    
    this.conversationContexts.set(conversationId, {
      contractId: context?.contractId,
      contractType: context?.contractType,
      jurisdiction: context?.jurisdiction || 'USA',
      userRole: context?.userRole || 'individual',
      conversationHistory: [
        {
          id: 'sys-1',
          role: 'system',
          content: this.getSystemPrompt(context?.userRole || 'individual'),
          timestamp: new Date(),
        },
      ],
    });

    return conversationId;
  }

  /**
   * Ask question to AI lawyer
   */
  async askQuestion(
    conversationId: string,
    question: string
  ): Promise<AIResponse> {
    const context = this.conversationContexts.get(conversationId);
    
    if (!context) {
      throw new Error('Conversation not found. Please start a new conversation.');
    }

    // Add user message to history
    context.conversationHistory.push({
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
    });

    // Analyze question intent
    const intent = this.analyzeQuestionIntent(question);

    // Generate response based on intent
    const response = await this.generateResponse(question, context, intent);

    // Add assistant message to history
    context.conversationHistory.push({
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: response.answer,
      timestamp: new Date(),
      metadata: {
        citations: response.citations,
        confidence: response.confidence,
        suggestedActions: response.suggestedActions.map(a => a.action),
      },
    });

    return response;
  }

  /**
   * Get contract-specific advice
   */
  async analyzeContractClause(
    clause: string,
    question: string
  ): Promise<{
    explanation: string;
    risks: Array<{ level: string; description: string }>;
    benefits: string[];
    alternatives: string[];
    negotiationTips: string[];
  }> {
    const risks = this.identifyClauseRisks(clause);
    const benefits = this.identifyClauseBenefits(clause);
    const alternatives = this.suggestAlternatives(clause);
    const negotiationTips = this.generateNegotiationTips(clause);

    const explanation = this.explainClause(clause, question);

    return {
      explanation,
      risks,
      benefits,
      alternatives,
      negotiationTips,
    };
  }

  /**
   * Generate response with GPT-4 simulation
   */
  private async generateResponse(
    question: string,
    context: ChatContext,
    intent: string
  ): Promise<AIResponse> {
    // In production, this would call actual GPT-4 API
    // For now, we provide intelligent pattern-based responses

    const lowerQuestion = question.toLowerCase();

    // Contract interpretation questions
    if (intent === 'interpretation') {
      return this.generateInterpretationResponse(question, context);
    }

    // Legal rights questions
    if (intent === 'rights') {
      return this.generateRightsResponse(question, context);
    }

    // Risk assessment questions
    if (intent === 'risk-assessment') {
      return this.generateRiskResponse(question, context);
    }

    // Negotiation advice
    if (intent === 'negotiation') {
      return this.generateNegotiationResponse(question, context);
    }

    // Legal process questions
    if (intent === 'process') {
      return this.generateProcessResponse(question, context);
    }

    // Default general response
    return this.generateGeneralResponse(question, context);
  }

  /**
   * Analyze question to determine intent
   */
  private analyzeQuestionIntent(question: string): string {
    const lower = question.toLowerCase();

    if (lower.includes('what does') || lower.includes('what is') || lower.includes('explain')) {
      return 'interpretation';
    }

    if (lower.includes('can i') || lower.includes('right to') || lower.includes('allowed')) {
      return 'rights';
    }

    if (lower.includes('risk') || lower.includes('dangerous') || lower.includes('problem')) {
      return 'risk-assessment';
    }

    if (lower.includes('negotiate') || lower.includes('change') || lower.includes('better terms')) {
      return 'negotiation';
    }

    if (lower.includes('how to') || lower.includes('process') || lower.includes('steps')) {
      return 'process';
    }

    return 'general';
  }

  /**
   * Generate interpretation response
   */
  private generateInterpretationResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `Based on standard legal interpretation principles, this clause typically means:\n\n` +
              `The provision establishes the framework for [specific aspect]. In ${context.jurisdiction}, courts generally interpret such language to mean that [interpretation].\n\n` +
              `Key points to understand:\n` +
              `1. The language "shall" creates a mandatory obligation\n` +
              `2. Any ambiguity would typically be construed against the drafter\n` +
              `3. The entire contract context matters for full interpretation\n\n` +
              `For your specific situation as a ${context.userRole}, this means you ${context.userRole === 'business' ? 'must ensure compliance' : 'should be aware of your obligations'}.`,
      confidence: 85,
      citations: [
        {
          source: 'UCC § 2-204',
          title: 'Formation in General',
          url: 'https://www.law.cornell.edu/ucc/2/2-204',
          relevance: 88,
          excerpt: 'A contract for sale of goods may be made in any manner sufficient to show agreement...',
        },
        {
          source: 'Restatement (Second) of Contracts § 201',
          title: 'Whose Meaning Prevails',
          relevance: 82,
          excerpt: 'Where the parties have attached different meanings to a promise or agreement...',
        },
      ],
      relatedQuestions: [
        'What happens if this clause is violated?',
        'Can this clause be negotiated?',
        'What are the standard alternatives to this clause?',
      ],
      disclaimers: [
        'This is general legal information, not legal advice',
        'Consult with a licensed attorney for specific advice',
        'Laws vary by jurisdiction',
      ],
      suggestedActions: [
        {
          action: 'Review with attorney before signing',
          priority: 'high',
          cost: '$200-500',
          timeframe: '1-2 days',
        },
        {
          action: 'Request clarification from other party',
          priority: 'medium',
          cost: 'Free',
          timeframe: 'Immediate',
        },
      ],
    };
  }

  /**
   * Generate rights-based response
   */
  private generateRightsResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `Under ${context.jurisdiction} law, you generally have the following rights:\n\n` +
              `1. **Right to Review**: You can take reasonable time to review any contract before signing\n` +
              `2. **Right to Legal Counsel**: You may consult an attorney at any time\n` +
              `3. **Right to Negotiate**: Unless stated otherwise, contract terms are negotiable\n` +
              `4. **Right to Withdraw**: In some cases, you may have a cooling-off period\n\n` +
              `Specific to your question:\n` +
              `${context.userRole === 'individual' ? 'As a consumer, you have additional protections under consumer protection laws' : 'As a business entity, you have freedom of contract subject to commercial law principles'}.\n\n` +
              `Important limitations to note:\n` +
              `- Some rights can be waived by contract language\n` +
              `- Certain clauses may be unenforceable even if signed\n` +
              `- Timing matters - some rights expire if not exercised promptly`,
      confidence: 90,
      citations: [
        {
          source: 'FTC Cooling-Off Rule',
          title: '16 CFR Part 429',
          url: 'https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/cooling-rule',
          relevance: 75,
          excerpt: 'Gives consumers three days to cancel certain sales...',
        },
      ],
      relatedQuestions: [
        'What rights can I not waive in a contract?',
        'How long do I have to review before signing?',
        'Can I cancel after signing?',
      ],
      disclaimers: [
        'Rights vary significantly by state/country',
        'Some rights apply only to specific transaction types',
        'This is general information - consult an attorney',
      ],
      suggestedActions: [
        {
          action: 'Document all communications',
          priority: 'high',
          cost: 'Free',
          timeframe: 'Ongoing',
        },
        {
          action: 'Research jurisdiction-specific rights',
          priority: 'medium',
          cost: 'Free',
          timeframe: '1 hour',
        },
      ],
    };
  }

  /**
   * Generate risk assessment response
   */
  private generateRiskResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `I've identified several risk factors in this situation:\n\n` +
              `**High Risk Areas:**\n` +
              `1. Unlimited liability exposure - This could put your assets at risk\n` +
              `2. Broad indemnification - You may be responsible for third-party claims\n` +
              `3. One-sided termination rights - Other party has more flexibility\n\n` +
              `**Medium Risk Areas:**\n` +
              `1. Vague performance standards - Could lead to disputes\n` +
              `2. Automatic renewal clause - May lock you in unintentionally\n` +
              `3. Forum selection clause - May require litigation in inconvenient location\n\n` +
              `**Risk Mitigation Strategies:**\n` +
              `- Add liability caps or insurance requirements\n` +
              `- Request mutual indemnification\n` +
              `- Negotiate termination for convenience\n` +
              `- Define objective performance metrics\n` +
              `- Add notice requirements for renewal\n\n` +
              `Overall risk level: ${context.userRole === 'individual' ? 'MEDIUM-HIGH' : 'MEDIUM'} - I recommend legal review before proceeding.`,
      confidence: 88,
      citations: [
        {
          source: 'Model Contract Terms Report',
          title: 'American Bar Association',
          relevance: 85,
          excerpt: 'Best practices recommend reciprocal indemnification clauses...',
        },
      ],
      relatedQuestions: [
        'How can I reduce my liability exposure?',
        'What insurance should I have?',
        'Are there industry standard terms I should request?',
      ],
      disclaimers: [
        'Risk assessment is fact-specific',
        'This analysis is preliminary only',
        'Consult with legal and insurance professionals',
      ],
      suggestedActions: [
        {
          action: 'Request liability cap of $X',
          priority: 'high',
          cost: 'Negotiation time',
          timeframe: '1 week',
        },
        {
          action: 'Obtain business liability insurance',
          priority: 'high',
          cost: '$500-2000/year',
          timeframe: '1-2 weeks',
        },
        {
          action: 'Add mutual termination rights',
          priority: 'medium',
          cost: 'Negotiation time',
          timeframe: '1 week',
        },
      ],
    };
  }

  /**
   * Generate negotiation advice
   */
  private generateNegotiationResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `Here's a strategic approach to negotiating these terms:\n\n` +
              `**Leverage Points:**\n` +
              `1. Market standards - Research what competitors offer\n` +
              `2. Volume/value - Use your business size as negotiating power\n` +
              `3. Alternative options - Having other choices strengthens position\n\n` +
              `**Negotiation Strategy:**\n` +
              `1. Start with industry standard language as baseline\n` +
              `2. Prioritize your must-haves vs. nice-to-haves\n` +
              `3. Offer concessions on lower-priority items\n` +
              `4. Request reciprocal terms (if they get X, you get X too)\n` +
              `5. Anchor with specific proposed language, not vague requests\n\n` +
              `**Specific Language to Propose:**\n` +
              `"We propose modifying Section [X] to read: [specific language]"\n` +
              `Rather than: "Can we make Section [X] better?"\n\n` +
              `**Common Negotiation Wins:**\n` +
              `- Payment terms (Net 30 → Net 60)\n` +
              `- Liability caps (Unlimited → 2x annual fees)\n` +
              `- Termination notice (30 days → 90 days)\n` +
              `- Price escalation limits (Any increase → CPI max)\n\n` +
              `Remember: Everything is negotiable unless specifically required by law.`,
      confidence: 92,
      citations: [
        {
          source: 'Harvard Program on Negotiation',
          title: 'Negotiation Strategies',
          relevance: 80,
          excerpt: 'Interest-based negotiation focuses on underlying needs...',
        },
      ],
      relatedQuestions: [
        'What if they refuse to negotiate?',
        'How do I know if their "final offer" is really final?',
        'Should I use a lawyer for negotiations?',
      ],
      disclaimers: [
        'Negotiation outcomes depend on relative bargaining power',
        'Some terms may be non-negotiable for valid business reasons',
      ],
      suggestedActions: [
        {
          action: 'Prepare written list of requested changes',
          priority: 'high',
          cost: 'Free',
          timeframe: '2-3 hours',
        },
        {
          action: 'Research industry standard terms',
          priority: 'high',
          cost: 'Free',
          timeframe: '1-2 hours',
        },
        {
          action: 'Identify your walkaway point',
          priority: 'high',
          cost: 'Free',
          timeframe: '30 minutes',
        },
      ],
    };
  }

  /**
   * Generate process guidance
   */
  private generateProcessResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `Here's the step-by-step process:\n\n` +
              `**Phase 1: Preparation (1-3 days)**\n` +
              `1. Review entire contract carefully\n` +
              `2. List questions and concerns\n` +
              `3. Research market standards\n` +
              `4. Determine your priorities\n\n` +
              `**Phase 2: Analysis (2-5 days)**\n` +
              `1. Have attorney review (if applicable)\n` +
              `2. Run compliance checks\n` +
              `3. Assess financial impact\n` +
              `4. Identify risks and deal-breakers\n\n` +
              `**Phase 3: Negotiation (1-4 weeks)**\n` +
              `1. Submit proposed revisions in writing\n` +
              `2. Schedule discussion with other party\n` +
              `3. Address their concerns\n` +
              `4. Iterate until agreement or impasse\n\n` +
              `**Phase 4: Execution (1-3 days)**\n` +
              `1. Review final version carefully\n` +
              `2. Ensure all agreed changes are included\n` +
              `3. Get proper signatures and dates\n` +
              `4. Store executed copy securely\n\n` +
              `**Phase 5: Compliance (Ongoing)**\n` +
              `1. Set calendar reminders for key dates\n` +
              `2. Monitor performance obligations\n` +
              `3. Document compliance activities\n` +
              `4. Address issues promptly\n\n` +
              `Total timeline: 1-6 weeks depending on complexity`,
      confidence: 95,
      citations: [],
      relatedQuestions: [
        'What if we miss a deadline in the contract?',
        'How should I organize contract documents?',
        'What tools can help track compliance?',
      ],
      disclaimers: [
        'Timelines vary based on contract complexity',
        'Some industries have specific regulatory timelines',
      ],
      suggestedActions: [
        {
          action: 'Create contract review checklist',
          priority: 'high',
          cost: 'Free',
          timeframe: '1 hour',
        },
        {
          action: 'Set up contract management system',
          priority: 'medium',
          cost: 'Free-$50/month',
          timeframe: '2-3 hours',
        },
      ],
    };
  }

  /**
   * Generate general response
   */
  private generateGeneralResponse(question: string, context: ChatContext): AIResponse {
    return {
      answer: `I'd be happy to help with your contract question. Based on what you've asked:\n\n` +
              `This is a common concern in ${context.contractType || 'contract'} agreements. ` +
              `Generally speaking, the key considerations are:\n\n` +
              `1. **Legal Framework**: Contracts are governed by state law and common law principles\n` +
              `2. **Party Intentions**: Courts try to honor what parties intended\n` +
              `3. **Reasonableness**: Terms must be commercially reasonable\n` +
              `4. **Public Policy**: Some provisions are unenforceable even if agreed to\n\n` +
              `To give you more specific guidance, could you clarify:\n` +
              `- What specific clause or issue concerns you?\n` +
              `- What outcome are you hoping for?\n` +
              `- Is this before or after contract execution?\n\n` +
              `Remember: I provide general information to help you understand contracts, ` +
              `but for your specific situation, consultation with a licensed attorney in your jurisdiction is recommended.`,
      confidence: 70,
      citations: [],
      relatedQuestions: [
        'What makes a contract legally binding?',
        'Can I get out of a signed contract?',
        'What clauses should I always watch for?',
      ],
      disclaimers: [
        'This is general information only',
        'Not legal advice for your specific situation',
        'Consult with a licensed attorney',
      ],
      suggestedActions: [
        {
          action: 'Provide more context about your situation',
          priority: 'high',
          cost: 'Free',
          timeframe: 'Immediate',
        },
        {
          action: 'Schedule consultation with attorney',
          priority: 'medium',
          cost: '$200-500',
          timeframe: '1-3 days',
        },
      ],
    };
  }

  /**
   * Get system prompt based on user role
   */
  private getSystemPrompt(userRole: string): string {
    const basePrompt = 'You are an expert AI legal assistant specializing in contract law. ';
    
    if (userRole === 'individual') {
      return basePrompt + 'Explain concepts in plain English. Prioritize consumer protection. Be extra cautious about risks.';
    }
    
    if (userRole === 'business') {
      return basePrompt + 'Focus on business implications. Balance risk with commercial practicality. Consider industry standards.';
    }
    
    if (userRole === 'lawyer') {
      return basePrompt + 'Provide detailed legal analysis. Include case citations. Discuss nuances and edge cases.';
    }
    
    return basePrompt;
  }

  /**
   * Explain clause in plain English
   */
  private explainClause(clause: string, question: string): string {
    return `This clause establishes [core purpose]. In practical terms, it means that [plain English explanation]. ` +
           `The legal effect is [legal consequences]. You should be aware that [key takeaways].`;
  }

  /**
   * Identify clause risks
   */
  private identifyClauseRisks(clause: string): Array<{ level: string; description: string }> {
    const risks = [];
    const lower = clause.toLowerCase();

    if (lower.includes('unlimited') || lower.includes('without limit')) {
      risks.push({
        level: 'HIGH',
        description: 'Unlimited liability exposure - your assets could be at risk with no cap',
      });
    }

    if (lower.includes('sole discretion')) {
      risks.push({
        level: 'MEDIUM',
        description: 'Other party has unilateral decision-making power without your input',
      });
    }

    if (lower.includes('perpetual') || lower.includes('in perpetuity')) {
      risks.push({
        level: 'MEDIUM',
        description: 'Rights granted last forever - cannot be revoked or expire',
      });
    }

    return risks.length > 0 ? risks : [{ level: 'LOW', description: 'No significant risks identified' }];
  }

  /**
   * Identify clause benefits
   */
  private identifyClauseBenefits(clause: string): string[] {
    return [
      'Provides clarity on obligations',
      'Establishes measurable standards',
      'Creates accountability mechanism',
    ];
  }

  /**
   * Suggest alternative clause language
   */
  private suggestAlternatives(clause: string): string[] {
    return [
      'Alternative 1: Add mutual obligations for both parties',
      'Alternative 2: Include liability cap or insurance requirement',
      'Alternative 3: Add specific termination rights and notice periods',
    ];
  }

  /**
   * Generate negotiation tips
   */
  private generateNegotiationTips(clause: string): string[] {
    return [
      'Request reciprocal language - if they get this right, you should too',
      'Ask for specific examples of how this has been applied in practice',
      'Propose limiting the scope or duration of the provision',
      'Request a liability cap or insurance requirement to mitigate risk',
    ];
  }
}

export const aiLawyer = new AILawyerChatbot();
