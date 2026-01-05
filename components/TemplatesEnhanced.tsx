'use client';

import { FileText, Star, Download, Copy, Eye, Search, Filter, TrendingUp, Users, Building, Briefcase, Lock, Code, Home, Handshake, DollarSign, Globe, Shield, Award, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function TemplatesEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const templates = [
    // Employment Templates
    { id: 1, name: 'Employment Offer Letter', category: 'Employment', difficulty: 'Beginner', description: 'Standard job offer with salary, benefits, and start date', downloads: 2847, rating: 4.9, icon: Briefcase },
    { id: 2, name: 'Employment Contract - Full Time', category: 'Employment', difficulty: 'Intermediate', description: 'Comprehensive employment agreement with detailed terms', downloads: 2134, rating: 4.8, icon: Briefcase },
    { id: 3, name: 'Independent Contractor Agreement', category: 'Employment', difficulty: 'Intermediate', description: 'For hiring contractors and 1099 workers', downloads: 1876, rating: 4.7, icon: Users },
    { id: 4, name: 'Internship Agreement', category: 'Employment', difficulty: 'Beginner', description: 'Agreement for paid or unpaid internship programs', downloads: 945, rating: 4.6, icon: Award },
    { id: 5, name: 'Employee Non-Compete Agreement', category: 'Employment', difficulty: 'Advanced', description: 'Restrict employees from competing post-employment', downloads: 1654, rating: 4.5, icon: Shield },
    
    // Confidentiality & IP
    { id: 6, name: 'Mutual Non-Disclosure Agreement (NDA)', category: 'Confidentiality', difficulty: 'Beginner', description: 'Two-way confidentiality agreement for both parties', downloads: 3247, rating: 4.9, icon: Lock },
    { id: 7, name: 'Unilateral NDA', category: 'Confidentiality', difficulty: 'Beginner', description: 'One-way NDA for disclosing party protection', downloads: 2856, rating: 4.8, icon: Lock },
    { id: 8, name: 'Intellectual Property Assignment', category: 'Confidentiality', difficulty: 'Advanced', description: 'Transfer ownership of IP rights', downloads: 1234, rating: 4.7, icon: Code },
    { id: 9, name: 'Work for Hire Agreement', category: 'Confidentiality', difficulty: 'Intermediate', description: 'Clarify IP ownership in creative work', downloads: 1567, rating: 4.6, icon: Code },
    
    // Freelance & Service
    { id: 10, name: 'Freelance Service Agreement', category: 'Freelance', difficulty: 'Intermediate', description: 'Comprehensive freelance project agreement', downloads: 2892, rating: 4.9, icon: Users },
    { id: 11, name: 'Consulting Services Agreement', category: 'Freelance', difficulty: 'Intermediate', description: 'Professional consulting engagement terms', downloads: 2145, rating: 4.8, icon: Briefcase },
    { id: 12, name: 'Master Service Agreement (MSA)', category: 'Freelance', difficulty: 'Advanced', description: 'Framework for ongoing service relationships', downloads: 1876, rating: 4.7, icon: Handshake },
    { id: 13, name: 'Statement of Work (SOW)', category: 'Freelance', difficulty: 'Intermediate', description: 'Detailed project scope and deliverables', downloads: 1654, rating: 4.6, icon: FileText },
    { id: 14, name: 'Retainer Agreement', category: 'Freelance', difficulty: 'Intermediate', description: 'Ongoing services with monthly retainer', downloads: 1432, rating: 4.5, icon: DollarSign },
    
    // SaaS & Technology
    { id: 15, name: 'SaaS Subscription Agreement', category: 'SaaS', difficulty: 'Advanced', description: 'Software-as-a-Service terms and conditions', downloads: 2634, rating: 4.8, icon: Code },
    { id: 16, name: 'Software License Agreement', category: 'SaaS', difficulty: 'Advanced', description: 'License terms for software products', downloads: 2156, rating: 4.7, icon: Code },
    { id: 17, name: 'API Terms of Service', category: 'SaaS', difficulty: 'Advanced', description: 'Terms for API access and usage', downloads: 1543, rating: 4.6, icon: Globe },
    { id: 18, name: 'Data Processing Agreement (DPA)', category: 'SaaS', difficulty: 'Advanced', description: 'GDPR-compliant data processing terms', downloads: 1876, rating: 4.8, icon: Shield },
    { id: 19, name: 'Website Terms of Service', category: 'SaaS', difficulty: 'Intermediate', description: 'Standard website user agreement', downloads: 2234, rating: 4.7, icon: Globe },
    { id: 20, name: 'Privacy Policy Template', category: 'SaaS', difficulty: 'Intermediate', description: 'GDPR and CCPA compliant privacy policy', downloads: 2987, rating: 4.9, icon: Shield },
    
    // Real Estate & Lease
    { id: 21, name: 'Residential Lease Agreement', category: 'Lease', difficulty: 'Intermediate', description: 'Standard apartment/house rental agreement', downloads: 3187, rating: 4.8, icon: Home },
    { id: 22, name: 'Commercial Lease Agreement', category: 'Lease', difficulty: 'Advanced', description: 'Office or retail space lease', downloads: 1987, rating: 4.7, icon: Building },
    { id: 23, name: 'Sublease Agreement', category: 'Lease', difficulty: 'Intermediate', description: 'Tenant subleasing to another party', downloads: 1234, rating: 4.6, icon: Home },
    { id: 24, name: 'Month-to-Month Rental Agreement', category: 'Lease', difficulty: 'Beginner', description: 'Flexible short-term rental terms', downloads: 1876, rating: 4.7, icon: Home },
    { id: 25, name: 'Roommate Agreement', category: 'Lease', difficulty: 'Beginner', description: 'Agreement between co-tenants', downloads: 1432, rating: 4.5, icon: Users },
    
    // Business & Partnership
    { id: 26, name: 'Partnership Agreement', category: 'Business', difficulty: 'Advanced', description: 'General partnership formation and terms', downloads: 1765, rating: 4.8, icon: Handshake },
    { id: 27, name: 'LLC Operating Agreement', category: 'Business', difficulty: 'Advanced', description: 'Limited liability company governance', downloads: 2134, rating: 4.9, icon: Building },
    { id: 28, name: 'Buy-Sell Agreement', category: 'Business', difficulty: 'Advanced', description: 'Transfer of business ownership interests', downloads: 987, rating: 4.7, icon: DollarSign },
    { id: 29, name: 'Joint Venture Agreement', category: 'Business', difficulty: 'Advanced', description: 'Collaboration between two businesses', downloads: 1234, rating: 4.6, icon: Handshake },
    { id: 30, name: 'Shareholder Agreement', category: 'Business', difficulty: 'Advanced', description: 'Rights and obligations of shareholders', downloads: 1543, rating: 4.8, icon: TrendingUp },
    
    // Sales & Vendor
    { id: 31, name: 'Sales Agreement', category: 'Sales', difficulty: 'Intermediate', description: 'General goods or services purchase', downloads: 2156, rating: 4.7, icon: DollarSign },
    { id: 32, name: 'Vendor Agreement', category: 'Sales', difficulty: 'Intermediate', description: 'Terms for supplier relationships', downloads: 1876, rating: 4.6, icon: Briefcase },
    { id: 33, name: 'Distribution Agreement', category: 'Sales', difficulty: 'Advanced', description: 'Authorize distributors to sell products', downloads: 1432, rating: 4.7, icon: Globe },
    { id: 34, name: 'Reseller Agreement', category: 'Sales', difficulty: 'Intermediate', description: 'Terms for reselling products/services', downloads: 1654, rating: 4.6, icon: TrendingUp },
    { id: 35, name: 'Purchase Order Template', category: 'Sales', difficulty: 'Beginner', description: 'Standard purchase order form', downloads: 2876, rating: 4.8, icon: FileText },
    
    // Specialized
    { id: 36, name: 'Influencer Marketing Agreement', category: 'Marketing', difficulty: 'Intermediate', description: 'Terms for social media influencer campaigns', downloads: 1876, rating: 4.7, icon: TrendingUp },
    { id: 37, name: 'Affiliate Agreement', category: 'Marketing', difficulty: 'Intermediate', description: 'Commission-based marketing partnership', downloads: 1543, rating: 4.6, icon: Globe },
    { id: 38, name: 'Photography Services Contract', category: 'Creative', difficulty: 'Intermediate', description: 'Photo shoot terms and usage rights', downloads: 1234, rating: 4.7, icon: Award },
    { id: 39, name: 'Video Production Agreement', category: 'Creative', difficulty: 'Intermediate', description: 'Video creation and licensing terms', downloads: 1098, rating: 4.6, icon: Code },
    { id: 40, name: 'Website Development Agreement', category: 'Creative', difficulty: 'Advanced', description: 'Web design and development contract', downloads: 1765, rating: 4.8, icon: Code },
    { id: 41, name: 'Loan Agreement', category: 'Financial', difficulty: 'Advanced', description: 'Personal or business loan terms', downloads: 1432, rating: 4.7, icon: DollarSign },
    { id: 42, name: 'Promissory Note', category: 'Financial', difficulty: 'Intermediate', description: 'Written promise to repay debt', downloads: 1876, rating: 4.6, icon: FileText },
    { id: 43, name: 'Settlement Agreement', category: 'Legal', difficulty: 'Advanced', description: 'Resolve disputes without litigation', downloads: 1234, rating: 4.8, icon: Handshake },
    { id: 44, name: 'Release of Liability', category: 'Legal', difficulty: 'Intermediate', description: 'Waiver of legal claims', downloads: 1654, rating: 4.7, icon: Shield },
    { id: 45, name: 'Power of Attorney', category: 'Legal', difficulty: 'Advanced', description: 'Authorize someone to act on your behalf', downloads: 1987, rating: 4.8, icon: Award },
  ];

  const categories = [
    { name: 'all', label: 'All Templates', count: templates.length, icon: FileText },
    { name: 'Employment', label: 'Employment', count: templates.filter(t => t.category === 'Employment').length, icon: Briefcase },
    { name: 'Confidentiality', label: 'Confidentiality & IP', count: templates.filter(t => t.category === 'Confidentiality').length, icon: Lock },
    { name: 'Freelance', label: 'Freelance & Service', count: templates.filter(t => t.category === 'Freelance').length, icon: Users },
    { name: 'SaaS', label: 'SaaS & Tech', count: templates.filter(t => t.category === 'SaaS').length, icon: Code },
    { name: 'Lease', label: 'Real Estate', count: templates.filter(t => t.category === 'Lease').length, icon: Home },
    { name: 'Business', label: 'Business & Partnership', count: templates.filter(t => t.category === 'Business').length, icon: Building },
    { name: 'Sales', label: 'Sales & Vendor', count: templates.filter(t => t.category === 'Sales').length, icon: DollarSign },
  ];

  const difficultyColors = {
    Beginner: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    Intermediate: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    Advanced: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || t.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleDownload = (template: typeof templates[0]) => {
    // Generate template overview
    const content = `${template.name}\n\n${template.description}\n\nCategory: ${template.category}\nDifficulty: ${template.difficulty}\nRating: ${template.rating}/5 (${template.downloads.toLocaleString()} downloads)\n\nThis template provides a framework for ${template.name.toLowerCase()}. Customize based on your specific needs and have it reviewed by a legal professional.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (template: typeof templates[0]) => {
    const content = `${template.name}\n\n${template.description}`;
    navigator.clipboard.writeText(content);
    alert('Template copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Contract Templates Library</h1>
          <p className="text-stone-600">45+ pre-built, customizable contract templates for every use case</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-stone-700">Total Templates</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{templates.length}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-stone-700">Total Downloads</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{(templates.reduce((sum, t) => sum + t.downloads, 0) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-stone-700">Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{(templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)}</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-stone-700">Categories</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{categories.length - 1}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedCategory === cat.name
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label} ({cat.count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Filter by Difficulty</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    selectedDifficulty === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                {Object.keys(difficultyColors).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff as keyof typeof difficultyColors].bg} ${difficultyColors[diff as keyof typeof difficultyColors].text} border-2 ${difficultyColors[diff as keyof typeof difficultyColors].border}`
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            const diffColor = difficultyColors[template.difficulty as keyof typeof difficultyColors];
            
            return (
              <div key={template.id} className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}>
                    {template.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                <p className="text-sm text-stone-600 mb-4 line-clamp-2">{template.description}</p>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-stone-900">{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setPreviewTemplate(template.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-all shadow-md hover:shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => handleCopy(template)}
                    aria-label="Copy template"
                    title="Copy template to clipboard"
                    className="p-2.5 border-2 border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-stone-600" />
                  </button>
                  <button 
                    onClick={() => handleDownload(template)}
                    aria-label="Download template"
                    className="p-2.5 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-stone-900 mb-2">No templates found</p>
            <p className="text-stone-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Results Count */}
        {filteredTemplates.length > 0 && (
          <div className="mt-6 text-center text-sm text-stone-600">
            Showing <span className="font-bold text-stone-900">{filteredTemplates.length}</span> of <span className="font-bold text-stone-900">{templates.length}</span> templates
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = templates.find(t => t.id === previewTemplate);
              if (!template) return null;
              const Icon = template.icon;
              
              return (
                <>
                  <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-stone-900">{template.name}</h2>
                        <p className="text-sm text-stone-600">{template.category} • {template.difficulty}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPreviewTemplate(null)}
                      aria-label="Close preview modal"
                      title="Close"
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-bold text-stone-900 mb-4">Template Preview</h3>
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-6">
                        <p className="text-stone-700 mb-4">{template.description}</p>
                        <div className="space-y-4 text-sm">
                          <p><strong>Category:</strong> {template.category}</p>
                          <p><strong>Difficulty Level:</strong> {template.difficulty}</p>
                          <p><strong>Rating:</strong> {template.rating} ⭐ ({template.downloads.toLocaleString()} downloads)</p>
                          <p><strong>Use Cases:</strong> This template is ideal for establishing clear terms and protecting both parties in {template.category.toLowerCase()} agreements.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-4">
                        <h4 className="font-bold text-stone-900 mb-3">Key Sections Included:</h4>
                        <ul className="space-y-2 text-sm text-stone-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Parties and definitions
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Scope of work/services
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Payment terms and schedule
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Intellectual property rights
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Confidentiality provisions
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Termination clauses
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Dispute resolution
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Governing law and jurisdiction
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> This is a preview. Download the full template to customize for your specific needs. Always consult with a legal professional before using any contract.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-stone-200 flex gap-3">
                    <button 
                      onClick={() => handleDownload(template)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download Template
                    </button>
                    <button 
                      onClick={() => handleCopy(template)}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-stone-300 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                      Copy
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
