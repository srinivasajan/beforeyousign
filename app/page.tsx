'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import { Shield, Loader2 } from 'lucide-react';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze contract');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BeforeYouSign</h1>
                <p className="text-sm text-gray-600">Democratizing legal comprehension</p>
              </div>
            </div>
            {analysis && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Analyze Another Contract
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis && !isAnalyzing && (
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Understand Your Contracts Before You Sign
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Most people participate in the modern economy while being legally illiterate by necessity.
                We're here to change that. Upload any contract and get instant AI-powered analysis
                that identifies risks, explains jargon, and protects your interests.
              </p>
            </div>

            {/* Upload Section */}
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Risk Detection</h3>
                <p className="text-sm text-gray-600">
                  Automatically identify IP transfers, liability clauses, auto-renewals, and other red flags
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Plain Language</h3>
                <p className="text-sm text-gray-600">
                  Complex legal jargon translated into simple explanations anyone can understand
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Advice</h3>
                <p className="text-sm text-gray-600">
                  Get specific recommendations on what to negotiate and how to protect yourself
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto text-center py-24">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Analyzing Your Contract
            </h3>
            <p className="text-gray-600">
              Our AI is reading through every clause, identifying risks, and preparing your analysis...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && <AnalysisResult analysis={analysis} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-600">
            BeforeYouSign is an AI-powered tool designed to help you understand contracts.
            It does not constitute legal advice. For legal matters, please consult a licensed attorney.
          </p>
        </div>
      </footer>
    </div>
  );
}
