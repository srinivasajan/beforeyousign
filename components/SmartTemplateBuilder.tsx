'use client';

import { useState, useEffect } from 'react';
import { SmartTemplateBuilder, ClauseLibraryItem, ClauseCategory, TemplateBuilder } from '@/lib/smart-template-builder';

export default function SmartTemplateBuilderComponent() {
  const [builder] = useState(() => {
    const b = new SmartTemplateBuilder();
    console.log('🔍 Builder created, library size:', b.getClausesByCategory('payment').length);
    return b;
  });
  const [selectedCategory, setSelectedCategory] = useState<ClauseCategory>('preamble');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [template, setTemplate] = useState<TemplateBuilder>({
    id: 'new-template',
    name: 'Untitled Contract',
    description: '',
    contractType: 'General',
    industry: 'General',
    sections: [],
    variables: [],
    createdBy: 'user',
    createdAt: new Date(),
    lastModified: new Date(),
    version: 1,
    status: 'draft',
    completeness: 0,
    riskScore: 50,
    missingRecommendedClauses: [],
    incompatibilities: [],
    collaborators: [],
    comments: [],
    changeHistory: [],
  });

  const categories: ClauseCategory[] = [
    'preamble',
    'scope',
    'payment',
    'deliverables',
    'timeline',
    'intellectual-property',
    'confidentiality',
    'data-protection',
    'warranties',
    'liability',
    'indemnification',
    'insurance',
    'termination',
    'dispute-resolution',
    'force-majeure',
    'assignment',
    'amendment',
    'notices',
    'governing-law',
    'miscellaneous',
    'definitions'
  ];

  const clauses = searchQuery
    ? builder.searchClauses(searchQuery)
    : builder.getClausesByCategory(selectedCategory);

  console.log(`📋 Category: ${selectedCategory}, Clauses found: ${clauses.length}`, clauses.map(c => c.title));

  const handleAddClause = (clause: ClauseLibraryItem) => {
    const newSection = {
      id: `section-${Date.now()}`,
      order: template.sections.length,
      title: clause.category,
      clauses: [{
        id: `clause-${Date.now()}`,
        clauseLibraryId: clause.id,
        variables: {},
        order: 0,
        locked: false,
        modified: false,
      }],
      optional: false,
      collapsible: true,
    };

    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
      lastModified: new Date(),
    });
  };

  const handleRemoveClause = (sectionId: string, clauseId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId
          ? { ...section, clauses: section.clauses.filter(c => c.id !== clauseId) }
          : section
      ).filter(section => section.clauses.length > 0),
      lastModified: new Date(),
    });
  };

  const completeness = builder.calculateCompleteness(template);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Clause Library Sidebar - Premium Design */}
      <div className="w-[420px] bg-white/80 backdrop-blur-xl border-r border-gray-200/50 overflow-hidden flex flex-col shadow-2xl">
        {/* Sticky Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Clause Library
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold text-indigo-600">{clauses.length}</span> professional clauses
              </p>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={viewMode === 'list' ? 'Grid view' : 'List view'}
            >
              {viewMode === 'list' ? '⊞' : '≡'}
            </button>
          </div>
          
          {/* Search Bar - Enhanced */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50 backdrop-blur"
            />
          </div>

          {/* Category Filter - Improved */}
          {!searchQuery && (
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ClauseCategory)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 font-medium text-gray-700 backdrop-blur cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clause List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-3'}>
            {clauses.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No clauses found</p>
                <p className="text-xs text-gray-500">Try a different category or search term</p>
              </div>
            )}
            {clauses.slice(0, 20).map(clause => (
              <div
                key={clause.id}
                className="group bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => handleAddClause(clause)}
              >
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-700 transition-colors pr-2 leading-tight">
                      {clause.title}
                    </h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap shadow-sm ${
                      clause.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' :
                      clause.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' :
                      'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
                    }`}>
                      {clause.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {clause.text.substring(0, 140)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-yellow-600 font-medium">
                      <span className="text-sm">⭐</span>
                      {clause.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                      <span className="text-sm">📊</span>
                      {clause.popularity}%
                    </span>
                    <span className="text-gray-500 font-medium">
                      {(clause.usageCount / 1000).toFixed(1)}k uses
                    </span>
                  </div>
                  {/* Add icon */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 shadow-lg">
                    +
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Builder - Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - Premium */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 max-w-2xl">
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  className="text-3xl font-bold border-none outline-none focus:ring-0 w-full text-gray-900 placeholder-gray-400 bg-transparent"
                  placeholder="Contract Title..."
                />
                <input
                  type="text"
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  className="text-base text-gray-600 border-none outline-none focus:ring-0 mt-2 w-full placeholder-gray-400 bg-transparent"
                  placeholder="Add description (optional)..."
                />
              </div>
              
              {/* Stats Cards */}
              <div className="flex gap-4 ml-8">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl min-w-[100px]">
                  <div className="text-4xl font-black mb-1">{completeness.score}%</div>
                  <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">Complete</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-xl min-w-[100px]">
                  <div className="text-4xl font-black mb-1">{template.sections.length}</div>
                  <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">Clauses</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all hover:scale-105">
                💾 Save Draft
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all">
                📤 Export
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all">
                👁️ Preview
              </button>
            </div>

            {/* Missing Clauses Warning */}
            {completeness.missing.length > 0 && (
              <div className="mt-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-300 rounded-2xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-900 mb-1">Missing Essential Clauses</p>
                    <p className="text-xs text-amber-800 font-medium">{completeness.missing.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {template.sections.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-xl">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-6 transition-transform">
                    <span className="text-6xl">📋</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Build Your Perfect Contract
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Click any clause from the library to add it to your contract.<br/>
                  Mix and match professional clauses to create the perfect agreement.
                </p>
                
                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-black shadow-lg">1</span>
                    <span className="text-sm font-semibold text-gray-700">Browse</span>
                  </div>
                  <span className="text-gray-400 font-bold">→</span>
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-black shadow-lg">2</span>
                    <span className="text-sm font-semibold text-gray-700">Click to Add</span>
                  </div>
                  <span className="text-gray-400 font-bold">→</span>
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-black shadow-lg">3</span>
                    <span className="text-sm font-semibold text-gray-700">Export</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto p-10">
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200/50">
                <div className="prose prose-lg max-w-none">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight">{template.name}</h1>
                  {template.description && (
                    <p className="text-lg text-gray-600 italic mb-8 pb-8 border-b-2 border-gray-200">{template.description}</p>
                  )}

                  {template.sections.map((section, sectionIdx) => (
                    <div key={section.id} className="mb-10">
                      <h2 className="text-2xl font-black text-gray-900 capitalize mb-6 pb-3 border-b-2 border-indigo-200 flex items-center gap-3">
                        <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-lg">
                          {sectionIdx + 1}
                        </span>
                        {section.title.replace(/-/g, ' ')}
                      </h2>
                      {section.clauses.map((clauseInstance) => {
                        const clause = builder['clauseLibrary'].get(clauseInstance.clauseLibraryId);
                        if (!clause) return null;

                        return (
                          <div key={clauseInstance.id} className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-gray-200 relative group hover:shadow-xl hover:border-indigo-300 transition-all">
                            <button
                              onClick={() => handleRemoveClause(section.id, clauseInstance.id)}
                              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110"
                            >
                              ✕
                            </button>
                            <h3 className="font-black mb-4 text-base text-indigo-900 uppercase tracking-wide">{clause.title}</h3>
                            <p className="text-base text-gray-800 leading-relaxed">{clause.text}</p>
                            {clause.variables.length > 0 && (
                              <div className="mt-5 pt-5 border-t-2 border-gray-300">
                                <p className="text-xs text-gray-600 mb-3 font-bold uppercase tracking-wide">Customize Variables:</p>
                                <div className="flex flex-wrap gap-2">
                                  {clause.variables.map(v => (
                                    <span key={v.name} className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-md">
                                      [{v.name}]
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3 justify-end">
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
