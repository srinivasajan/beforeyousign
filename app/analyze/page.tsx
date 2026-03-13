'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import { Loader2, ArrowLeft, CheckCircle, Shield, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File, jurisdiction: string) => {
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jurisdiction', jurisdiction);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      // Check content type before parsing JSON to handle HTML error pages
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response (not JSON). The analysis API might be experiencing issues.');
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to analyze contract (Status: ${response.status})`);
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
    <div className="min-h-screen bg-stone-50">
      {/* Page Actions */}
      {analysis && (
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-stone-900 bg-white border border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-all"
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        {!analysis && !isAnalyzing && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-stone-900 mb-4">
                Upload Your Contract
              </h2>
              <p className="text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
                Submit your contract for comprehensive analysis. Our AI will identify risks,
                translate complex provisions, and provide strategic recommendations.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-stone-500">
                <Shield className="w-4 h-4 text-stone-700" />
                <span className="text-sm">Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <Lock className="w-4 h-4 text-stone-700" />
                <span className="text-sm">Data Not Stored</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <div className="w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">AI</span>
                </div>
                <span className="text-sm">NVIDIA Nemotron-70B</span>
              </div>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
          </div>
        )}

        {/* Loading State with Progress */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto py-12">
            <div className="bg-white border-2 border-stone-900 p-10">
              <div className="flex items-start gap-6 mb-8">
                <Loader2 className="w-10 h-10 text-stone-900 animate-spin flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-stone-900 mb-3">
                    Analyzing Your Contract
                  </h3>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    Our AI is conducting a comprehensive review. This typically takes 30-60 seconds.
                  </p>

                  {/* Progress Steps */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-900 rounded-full animate-pulse"></div>
                      <span className="text-sm text-stone-700">Parsing document structure...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse pulse-delay-200"></div>
                      <span className="text-sm text-stone-600">Identifying key clauses...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-300 rounded-full animate-pulse pulse-delay-400"></div>
                      <span className="text-sm text-stone-500">Evaluating risk factors...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-200 rounded-full animate-pulse pulse-delay-600"></div>
                      <span className="text-sm text-stone-400">Comparing to industry standards...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-stone-100 rounded-full animate-pulse pulse-delay-800"></div>
                      <span className="text-sm text-stone-300">Generating recommendations...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Signal */}
              <div className="border-t border-stone-200 pt-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <div className="w-4 h-4 bg-stone-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <span>Your contract is not stored. Analysis is private and secure.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-stone-900 p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-3">Analysis Error</h3>
              <p className="text-stone-700 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 transition-colors"
              >
                Restart Analysis
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && <AnalysisResult analysis={analysis} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-stone-900 mt-32">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="pt-8 flex items-center justify-between">
            <p className="text-xs text-stone-500 mono">© 2025 BeforeYouSign. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <span className="hover:text-stone-900 transition-colors cursor-pointer underline-effect">Privacy Policy</span>
              <span className="hover:text-stone-900 transition-colors cursor-pointer underline-effect">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
