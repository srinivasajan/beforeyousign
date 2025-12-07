'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AnalyzePage() {
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
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white executive-header sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="group flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <span className="text-stone-300">|</span>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Contract Analysis</h1>
            </div>
            {analysis && (
              <button
                onClick={handleReset}
                className="group px-6 py-2.5 text-sm font-medium text-stone-900 bg-white border border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-all duration-300"
              >
                <span className="underline-effect">New Analysis</span>
              </button>
            )}
          </div>
        </div>
      </header>

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

            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto py-24">
            <div className="border-l-2 border-stone-900 pl-8">
              <Loader2 className="w-12 h-12 text-stone-900 animate-spin mb-6" />
              <h3 className="text-3xl font-bold text-stone-900 mb-3">
                Analysis in Progress
              </h3>
              <p className="text-stone-600 text-lg leading-relaxed">
                Conducting comprehensive review of contractual provisions, 
                evaluating risk factors, and preparing executive summary...
              </p>
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
