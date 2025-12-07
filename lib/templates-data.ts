// Contract templates library
// Vetted, balanced contract templates for common use cases

export const contractTemplates = [
  {
    id: 'freelance-web-dev',
    name: 'Freelance Web Development Agreement',
    category: 'Freelance/Consulting',
    description: 'Balanced agreement for freelance web developers with fair IP terms and reasonable protections for both parties.',
    riskScore: 25,
    useCase: 'Independent web developers, designers, and consultants working with clients on project basis',
    downloadUrl: '/templates/freelance-web-dev.pdf',
    preview: `Key Features:
- Hourly or project-based compensation
- Clear IP ownership (client owns deliverables, contractor keeps tools)
- 30-day termination notice
- Reasonable confidentiality (3 years)
- Mutual liability caps
- Portfolio usage rights for contractor`,
  },
  {
    id: 'freelance-general',
    name: 'General Freelance Services Agreement',
    category: 'Freelance/Consulting',
    description: 'Versatile template for various freelance services with customizable scope.',
    riskScore: 20,
    useCase: 'Writers, designers, marketers, consultants, and other service providers',
    downloadUrl: '/templates/freelance-general.pdf',
    preview: `Key Features:
- Flexible service descriptions
- Independent contractor status clearly defined
- Fair payment terms (net 30)
- Balanced IP provisions
- Reasonable dispute resolution`,
  },
  {
    id: 'saas-fair',
    name: 'Fair SaaS Terms of Service',
    category: 'Software/SaaS',
    description: 'Customer-friendly SaaS agreement with reasonable data rights and liability terms.',
    riskScore: 35,
    useCase: 'Small to medium SaaS businesses wanting to build trust with reasonable terms',
    downloadUrl: '/templates/saas-fair.pdf',
    preview: `Key Features:
- Customer retains data ownership
- Reasonable cancellation (30 days)
- Pro-rated refunds available
- Transparent pricing and changes
- Limited arbitration (optional court)
- Standard liability caps (12 months fees)`,
  },
  {
    id: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement',
    category: 'Confidentiality',
    description: 'Balanced NDA protecting both parties equally.',
    riskScore: 15,
    useCase: 'Business discussions, partnerships, vendor relationships where both sides share sensitive information',
    downloadUrl: '/templates/nda-mutual.pdf',
    preview: `Key Features:
- Mutual obligations (both parties protected)
- 2-3 year term
- Clear exclusions (public info, prior knowledge)
- Reasonable return/destruction requirements
- No automatic injunctive relief`,
  },
  {
    id: 'employment-fair',
    name: 'Fair Employment Agreement',
    category: 'Employment',
    description: 'Employee-friendly agreement with balanced IP and non-compete terms.',
    riskScore: 30,
    useCase: 'Small to medium businesses hiring employees with fair terms',
    downloadUrl: '/templates/employment-fair.pdf',
    preview: `Key Features:
- At-will employment disclosed
- IP assignment limited to work-related inventions
- Reasonable non-compete (6-12 months, narrow scope)
- 2 weeks notice from both sides
- Confidentiality expires 2 years after termination
- Arbitration optional, not mandatory`,
  },
  {
    id: 'contractor-agreement',
    name: 'Independent Contractor Agreement',
    category: 'Freelance/Consulting',
    description: 'Clear IC classification with proper legal safeguards.',
    riskScore: 25,
    useCase: 'Companies hiring independent contractors with proper classification',
    downloadUrl: '/templates/contractor-agreement.pdf',
    preview: `Key Features:
- Clear IC vs employee distinctions
- Contractor controls methods and means
- No benefits or employment relationship
- Own tools and equipment
- Can work for others
- Proper tax treatment`,
  },
  {
    id: 'lease-tenant-friendly',
    name: 'Tenant-Friendly Residential Lease',
    category: 'Real Estate',
    description: 'Balanced residential lease with fair terms and legal protections.',
    riskScore: 35,
    useCase: 'Residential rentals with terms compliant with tenant protection laws',
    downloadUrl: '/templates/lease-tenant-friendly.pdf',
    preview: `Key Features:
- 30-60 day notice for both parties
- Security deposit caps (1-2 months)
- Landlord maintenance obligations
- Reasonable entry notice (24-48 hours)
- Normal wear and tear excluded
- Fair rent increase limits`,
  },
  {
    id: 'purchase-order',
    name: 'Standard Purchase Order Terms',
    category: 'Commercial',
    description: 'Balanced terms for purchasing goods or services.',
    riskScore: 20,
    useCase: 'B2B purchases of goods or services',
    downloadUrl: '/templates/purchase-order.pdf',
    preview: `Key Features:
- Clear payment terms
- Delivery schedules and acceptance
- Warranty provisions
- Reasonable indemnification
- Dispute resolution process`,
  },
];

export const clauseAlternatives = [
  {
    id: 'ip-assignment-1',
    originalClause: 'Employee assigns to Company all inventions, discoveries, and ideas conceived during employment and for 2 years after termination, whether related to Company business or not.',
    fairerVersion: 'Employee assigns to Company inventions and works created during employment using Company resources or relating to Company\'s business. Personal projects and prior inventions remain Employee\'s property.',
    explanation: 'This limits IP assignment to work actually related to the job, protecting employees\' side projects and personal creativity. The 2-year post-employment period is removed as it\'s likely unenforceable and unfair.',
    votes: 847,
    source: 'legal_standard',
    contributor: 'Employment Law Center',
  },
  {
    id: 'non-compete-1',
    originalClause: 'Employee agrees not to engage in any competitive business for 3 years after termination anywhere in the United States.',
    fairerVersion: 'Employee agrees not to directly solicit Company\'s clients or work for Company\'s direct competitors in [specific city/region] for 6 months after termination in a substantially similar role.',
    explanation: 'Reduces duration from 3 years to 6 months, narrows geography to where Company actually operates, and limits scope to direct competition in same role. Courts favor narrow, reasonable restrictions.',
    votes: 1203,
    source: 'expert',
    contributor: 'Sarah Chen, Employment Attorney',
  },
  {
    id: 'termination-notice-1',
    originalClause: 'Company may terminate immediately without notice. Employee must provide 120 days notice and forfeit all compensation if inadequate notice given.',
    fairerVersion: 'Either party may terminate with 30 days written notice. If Employee provides less notice, Employee remains entitled to compensation for work performed through actual termination date.',
    explanation: 'Makes notice period mutual and reasonable. Employees can\'t be forced to forfeit earned wages, which may violate wage laws in many states.',
    votes: 956,
    source: 'legal_standard',
    contributor: 'State Labor Department Guidelines',
  },
  {
    id: 'auto-renewal-1',
    originalClause: 'Subscription automatically renews annually. Cancellation requires 90 days advance notice or full year payment is due.',
    fairerVersion: 'Subscription automatically renews annually. Customer may cancel at any time with 30 days notice. If canceled mid-term, Customer receives pro-rated refund of unused portion.',
    explanation: 'Reduces cancellation notice from 90 to 30 days and adds pro-rated refunds, which are standard consumer protection. Long cancellation windows and no-refund policies often violate consumer protection laws.',
    votes: 1445,
    source: 'legal_standard',
    contributor: 'Consumer Rights Coalition',
  },
  {
    id: 'data-rights-1',
    originalClause: 'Customer grants Provider perpetual, irrevocable license to use, modify, and resell all Customer Data for any purpose.',
    fairerVersion: 'Customer retains all ownership of Customer Data. Provider may use Customer Data solely to provide the service. Upon termination, Provider will delete or return all Customer Data within 30 days.',
    explanation: 'Customer should own their data. Provider should only use it to deliver the service. Perpetual licenses and data resale rights are major privacy violations.',
    votes: 2103,
    source: 'legal_standard',
    contributor: 'GDPR Best Practices',
  },
  {
    id: 'liability-cap-1',
    originalClause: 'Provider\'s total liability is limited to $50 regardless of damages caused or amount Customer paid.',
    fairerVersion: 'Provider\'s liability is limited to the amount paid by Customer in the 12 months preceding the claim. This limitation does not apply to Provider\'s gross negligence, willful misconduct, or data breaches.',
    explanation: 'Caps should be reasonable (typically 12 months of fees) and shouldn\'t shield truly negligent behavior. Token amounts like $50 are unconscionable and likely unenforceable.',
    votes: 1654,
    source: 'expert',
    contributor: 'Tech Contracts Weekly',
  },
  {
    id: 'arbitration-1',
    originalClause: 'All disputes resolved through binding arbitration. Customer pays all costs and waives all rights to court or class action. Arbitration is confidential and results may not be disclosed.',
    fairerVersion: 'Disputes may be resolved through small claims court or optional mediation. If mediation fails, either party may pursue litigation. Each party bears own costs unless prevailing party entitled to fees under applicable law.',
    explanation: 'Forced arbitration clauses, especially with customer paying costs, favor companies. Optional mediation preserves access to courts. Confidentiality requirements prevent pattern discovery.',
    votes: 1876,
    source: 'community',
    contributor: 'Fair Shake Legal Clinic',
  },
  {
    id: 'indemnification-1',
    originalClause: 'Customer indemnifies Provider from all claims arising from Customer\'s use of service, regardless of Provider\'s negligence or fault.',
    fairerVersion: 'Each party indemnifies the other for claims arising from that party\'s breach of this Agreement or negligence. Neither party indemnifies for the other party\'s own misconduct.',
    explanation: 'Indemnification should be mutual and not cover the other party\'s own wrongdoing. Making one party liable regardless of the other\'s fault is unconscionable.',
    votes: 1234,
    source: 'legal_standard',
    contributor: 'Commercial Contracts Guide',
  },
  {
    id: 'amendment-rights-1',
    originalClause: 'Company may modify this Agreement at any time by posting changes on website. Continued use constitutes acceptance. Customer has no right to reject changes.',
    fairerVersion: 'Company may modify this Agreement with 60 days advance notice to Customer. Material changes require Customer\'s affirmative consent. Customer may reject changes and terminate without penalty.',
    explanation: 'Unilateral amendment rights are unfair. Material changes need real consent, not passive "continued use." Customers should be able to opt out without penalty.',
    votes: 1567,
    source: 'legal_standard',
    contributor: 'Model Contract Terms Project',
  },
  {
    id: 'security-deposit-1',
    originalClause: 'Security deposit equals 3 months rent, is non-refundable, and Landlord may use for any purpose. Normal wear and tear is Tenant\'s responsibility.',
    fairerVersion: 'Security deposit equals one month\'s rent. Deposit will be returned within 30 days after move-out, less itemized deductions for damages beyond normal wear and tear. Normal wear and tear is Landlord\'s responsibility.',
    explanation: 'Most jurisdictions cap deposits at 1-2 months and require return within 30-60 days with itemized deductions. "Non-refundable deposits" are actually non-refundable fees, which have different rules. Normal wear is always landlord\'s responsibility.',
    votes: 2234,
    source: 'legal_standard',
    contributor: 'Tenant Rights Handbook',
  },
];
