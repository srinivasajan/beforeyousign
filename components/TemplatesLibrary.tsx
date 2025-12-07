'use client';

import { contractTemplates } from '@/lib/templates-data';
import { Download, FileText, Shield, TrendingDown } from 'lucide-react';

export default function TemplatesLibrary() {
  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    if (score >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const categories = Array.from(new Set(contractTemplates.map(t => t.category)));

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-stone-900"></div>
          <span className="mono text-xs text-stone-500 tracking-wider uppercase">Contract Templates</span>
          <div className="h-px w-12 bg-stone-900"></div>
        </div>
        <h2 className="text-6xl font-bold text-stone-900 mb-4">Fair Contract Templates</h2>
        <p className="text-xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
          Vetted, balanced contract templates that protect both parties. 
          <span className="text-stone-900 font-medium"> No hidden traps. No one-sided terms.</span>
        </p>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const templates = contractTemplates.filter(t => t.category === category);
        
        return (
          <div key={category} className="mb-16">
            <div className="mb-6 pb-4 border-b-2 border-stone-200">
              <h3 className="text-3xl font-bold text-stone-900">{category}</h3>
              <p className="text-sm text-stone-500 mt-2">{templates.length} templates available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="group bg-white border-2 border-stone-900 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-stone-900" />
                      <div>
                        <h4 className="text-2xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                          {template.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${
                        template.riskScore < 30 ? 'text-green-600' : 
                        template.riskScore < 50 ? 'text-yellow-600' : 
                        'text-orange-600'
                      }`} />
                      <span className={`mono text-sm font-bold px-3 py-1 rounded ${getRiskColor(template.riskScore)}`}>
                        {template.riskScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed mb-4">{template.description}</p>

                  <div className="mb-4 p-4 bg-stone-50 border-l-2 border-stone-900">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-2">Best For</p>
                    <p className="text-sm text-stone-800">{template.useCase}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-3">Key Features</p>
                    <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-light">
                      {template.preview}
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors duration-300 group">
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    Download Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-12 border-2 border-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingDown className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h3 className="text-4xl font-bold mb-4">Level the Playing Field</h3>
          <p className="text-xl text-stone-300 font-light leading-relaxed mb-8">
            These templates are designed to be fair to both parties. Unlike one-sided corporate contracts,
            they protect your interests while remaining professional and enforceable.
          </p>
          <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Legally Vetted</span>
            </div>
            <div className="w-px h-4 bg-stone-600"></div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Industry Standard</span>
            </div>
            <div className="w-px h-4 bg-stone-600"></div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span>Low Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
