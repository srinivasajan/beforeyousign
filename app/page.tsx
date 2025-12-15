'use client';

import { ArrowRight, AlertTriangle, Scale, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="max-w-5xl">
            <div className="mb-4">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Legal Intelligence Platform</span>
            </div>
            
            <h2 className="text-6xl font-bold text-stone-900 mb-8 leading-[1.1] tracking-tight">
              From issues to answers, <span className="text-stone-600">your legal world made simple</span>
            </h2>

            <div className="border-l-4 border-stone-900 pl-6 mb-8">
              <p className="text-lg text-stone-700 leading-relaxed font-light mb-4">
                Most people face contracts they don't understand, written by lawyers for lawyers. 
                We decode complex legal language into clear, actionable insights that protect your interests.
              </p>
              <p className="text-base text-stone-600 leading-relaxed font-light">
                Upload any contract and get instant analysis of risks, obligations, and hidden clauses. 
                Know what you're signing before you sign it.
              </p>
            </div>

            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-300 group"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="mb-4">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">The Problem</span>
              </div>
              <h3 className="text-4xl font-bold text-stone-900 mb-6 leading-tight">
                A Massive, Systemic Asymmetry
              </h3>
              <p className="text-base text-stone-700 leading-relaxed font-light mb-4">
                Hiring a lawyer for every contract is economically impossible. The stronger party's lawyers 
                understand every word; the weaker party understands almost none.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Ordinary people rely on intuition, Google searches, or misplaced trust when making 
                decisions that can fundamentally alter their economic position.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-2 border-stone-900 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Trillions in Avoidable Costs</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Global inefficiency from avoidable disputes, lost leverage, and compromised decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-stone-900 p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Unbalanced Negotiations</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      One party with institutional knowledge and counsel; the other with hope and a pen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-stone-900 p-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Hidden Consequences</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Critical provisions buried in legalese that shift risk in ways most will never detect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-white py-16 border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="mb-4">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">The Solution</span>
            </div>
            <h3 className="text-4xl font-bold text-stone-900 mb-6 leading-tight">
              Democratizing Legal Comprehension
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed font-light">
              <strong className="text-stone-900">Legal comprehension has never been democratized</strong>. Until now.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">01</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Risk Detection</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Automated identification of IP transfers, unlimited liability, auto-renewals, 
                and hidden penalties.
              </p>
            </div>

            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">02</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Plain Language</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Legal jargon decoded into clear explanations revealing what you're actually agreeing to.
              </p>
            </div>

            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <Scale className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">03</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Strategic Guidance</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Specific negotiation points and protective measures to level the playing field.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-300 group"
            >
              <span>Analyze Your Contract</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-20" style={{
        background: '#1c1917',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#1c1917',
          zIndex: 0
        }} />
        <div className="max-w-3xl mx-auto px-8 text-center" style={{position: 'relative', zIndex: 10}}>
          <h3 className="text-4xl font-bold mb-6 leading-tight">
            Stop Signing Contracts You Don't Understand
          </h3>
          <p className="text-base text-stone-300 leading-relaxed font-light mb-8">
            Every contract you sign without comprehension is a blind risk. 
            Level the playing field with institutional-grade intelligence.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-all duration-300 group"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-stone-400">No account • Instant results • Free</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="grid md:grid-cols-2 gap-10 mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">BeforeYouSign</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Democratizing legal comprehension through institutional-grade contract intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Legal Notice</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                <span className="font-medium text-stone-900">Disclaimer:</span> This platform provides analytical intelligence 
                and does not constitute legal counsel. Material matters should be reviewed by qualified legal counsel.
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <p className="text-xs text-stone-500 mono">© 2025 BeforeYouSign</p>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="hover:text-stone-900 transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-stone-900 transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
