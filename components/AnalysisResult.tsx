'use client';

import { ContractAnalysis } from '@/lib/types';
import { AlertTriangle, CheckCircle, XCircle, Info, Download } from 'lucide-react';

interface AnalysisResultProps {
  analysis: ContractAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'High Risk';
    if (score >= 50) return 'Medium-High Risk';
    if (score >= 25) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'danger': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'warning': return <Info className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header with Risk Score */}
      <div className="bg-white border-2 border-stone-900 p-10">
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-stone-900"></div>
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Analysis Report</span>
            </div>
            <h2 className="text-5xl font-bold text-stone-900 mb-3">Executive Analysis</h2>
            <p className="text-sm text-stone-500 mono tracking-wide">{analysis.metadata.fileName}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-all duration-300 no-print"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="metric-box p-8 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Risk Assessment</p>
              <span className="mono text-xs text-stone-400">01</span>
            </div>
            <p className="text-6xl font-bold text-stone-900 mb-2 tabular-nums">{analysis.riskScore}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                analysis.riskScore >= 75 ? 'bg-stone-900' :
                analysis.riskScore >= 50 ? 'bg-stone-700' :
                analysis.riskScore >= 25 ? 'bg-stone-500' :
                'bg-stone-300'
              }`}></div>
              <p className="text-sm text-stone-600 font-medium">{getRiskLabel(analysis.riskScore)}</p>
            </div>
          </div>
          <div className="metric-box p-8 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Critical Issues</p>
              <span className="mono text-xs text-stone-400">02</span>
            </div>
            <p className="text-6xl font-bold text-stone-900 mb-2 tabular-nums">{analysis.redFlags.length}</p>
            <p className="text-sm text-stone-600 font-medium">Flagged for Review</p>
          </div>
          <div className="metric-box p-8 group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Provisions</p>
              <span className="mono text-xs text-stone-400">03</span>
            </div>
            <p className="text-6xl font-bold text-stone-900 mb-2 tabular-nums">{analysis.clauses.length}</p>
            <p className="text-sm text-stone-600 font-medium">Clauses Analyzed</p>
          </div>
        </div>

        <div className="border-l-2 border-stone-900 pl-8 bg-stone-50/50 p-6 -mx-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Executive Summary</h3>
            <div className="h-px flex-1 bg-stone-200"></div>
          </div>
          <p className="text-stone-700 leading-relaxed text-lg font-light">{analysis.summary}</p>
        </div>
      </div>

      {/* Red Flags Section */}
      {analysis.redFlags.length > 0 && (
        <div className="bg-white border-2 border-stone-900 p-10">
          <div className="mb-8 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-stone-900"></div>
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Risk Assessment</span>
            </div>
            <h3 className="text-4xl font-bold text-stone-900">
              Material Risk Factors
            </h3>
          </div>
          <div className="space-y-8">
            {analysis.redFlags.map((flag, index) => (
              <div
                key={flag.id}
                className="group border-l-2 border-stone-900 pl-8 py-3 hover:border-l-4 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="mono text-sm text-stone-400 font-medium">{String(index + 1).padStart(2, '0')}</span>
                      <h4 className="text-2xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">{flag.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1.5 uppercase font-semibold tracking-wider ${
                        flag.severity === 'critical' ? 'bg-stone-900 text-white' :
                        flag.severity === 'danger' ? 'bg-stone-700 text-white' :
                        'bg-stone-300 text-stone-900'
                      }`}>
                        {flag.severity}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-stone-700 leading-relaxed text-lg mb-6">{flag.description}</p>
                <div className="bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-1 rounded-full bg-stone-900"></div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Recommended Action</p>
                  </div>
                  <p className="text-stone-800 leading-relaxed">{flag.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clauses Section */}
      <div className="bg-white border-2 border-stone-900 p-8">
        <h3 className="text-3xl font-bold text-stone-900 mb-6 pb-4 border-b-2 border-stone-200">
          Detailed Provision Analysis
        </h3>
        <div className="space-y-8">
          {analysis.clauses.map((clause, index) => (
            <div
              key={clause.id}
              className="border-t border-stone-200 pt-6 first:border-0 first:pt-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-stone-400 font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="text-xl font-bold text-stone-900">{clause.title}</h4>
                </div>
                <span className={`text-xs px-3 py-1 uppercase font-semibold tracking-wider ${
                  clause.riskLevel === 'critical' ? 'bg-stone-900 text-white' :
                  clause.riskLevel === 'high' ? 'bg-stone-700 text-white' :
                  clause.riskLevel === 'medium' ? 'bg-stone-400 text-white' :
                  'bg-stone-200 text-stone-900'
                }`}>
                  {clause.riskLevel}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Contractual Language</p>
                <p className="text-sm text-stone-600 italic bg-stone-50 p-4 border-l-2 border-stone-300 font-serif leading-relaxed">
                  "{clause.originalText}"
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Translation</p>
                <p className="text-stone-800 bg-white p-4 border-l-2 border-stone-900 leading-relaxed">
                  {clause.plainLanguage}
                </p>
              </div>

              {clause.concerns.length > 0 && (
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Strategic Considerations</p>
                  <ul className="space-y-2">
                    {clause.concerns.map((concern, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-stone-400 mt-1.5">—</span>
                        <p className="text-stone-700 leading-relaxed">{concern}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-white border-2 border-stone-900 p-8">
          <h3 className="text-3xl font-bold text-stone-900 mb-6 pb-4 border-b-2 border-stone-200">
            Strategic Recommendations
          </h3>
          <ul className="space-y-4">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-4 border-l-2 border-stone-900 pl-6 py-2">
                <span className="text-stone-400 font-mono text-sm mt-1">{String(idx + 1).padStart(2, '0')}</span>
                <p className="text-stone-800 leading-relaxed flex-1">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
