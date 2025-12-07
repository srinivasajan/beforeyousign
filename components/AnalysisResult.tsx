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
    <div className="w-full space-y-6">
      {/* Header with Risk Score */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contract Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">{analysis.metadata.fileName}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className={`p-4 rounded-lg border-2 ${getRiskColor(analysis.riskScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">Risk Score</p>
              <p className="text-3xl font-bold mt-1">{analysis.riskScore}/100</p>
              <p className="text-sm mt-1">{getRiskLabel(analysis.riskScore)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{analysis.redFlags.length} Red Flags</p>
              <p className="text-sm">{analysis.clauses.length} Clauses Analyzed</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-gray-700">{analysis.summary}</p>
        </div>
      </div>

      {/* Red Flags Section */}
      {analysis.redFlags.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Red Flags ({analysis.redFlags.length})
          </h3>
          <div className="space-y-4">
            {analysis.redFlags.map((flag) => (
              <div
                key={flag.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(flag.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{flag.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full uppercase font-semibold ${
                        flag.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        flag.severity === 'danger' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{flag.description}</p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Recommendation:</p>
                      <p className="text-sm text-blue-800">{flag.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clauses Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Clause-by-Clause Analysis ({analysis.clauses.length})
        </h3>
        <div className="space-y-4">
          {analysis.clauses.map((clause) => (
            <div
              key={clause.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{clause.title}</h4>
                <span className={`text-xs px-2 py-1 rounded border uppercase font-semibold ${getRiskLevelColor(clause.riskLevel)}`}>
                  {clause.riskLevel}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Original Text:</p>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border">
                  {clause.originalText}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Plain Language:</p>
                <p className="text-sm text-gray-800 bg-green-50 p-3 rounded border border-green-200">
                  {clause.plainLanguage}
                </p>
              </div>

              {clause.concerns.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Concerns:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {clause.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{concern}</li>
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <p className="text-gray-700">{rec}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
