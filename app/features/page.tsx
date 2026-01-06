'use client';

import Link from 'next/link';
import { FileSearch, BookTemplate, TrendingUp, Users, Calendar, FileSignature } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚀 Revolutionary Features
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Most Advanced Contract Platform Ever Built
            </h1>
            <p className="text-xl text-gray-600">
              Transform how you create, manage, and optimize contracts with AI-powered features that save time and money
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Contract Drafting */}
          <Link href="/drafting" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-blue-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FileSearch className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">AI Contract Drafting</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                Create complete, professional contracts from natural language in 30 seconds. Just describe what you need.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Natural language input - no legal expertise needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>3 variations: balanced, protective, simple</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>AI clause recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Learn from your feedback</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Try AI Drafting <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          {/* Smart Template Builder */}
          <Link href="/template-builder" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-purple-500">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BookTemplate className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">Smart Template Builder</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                Build custom contracts with drag-and-drop from a library of 500+ professional clauses.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>500+ professional clause library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Drag-and-drop interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>AI compatibility checking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">✓</span>
                  <span>Completeness scoring</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Build Templates <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          {/* Business Intelligence */}
          <Link href="/intelligence" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-green-500">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">Business Intelligence</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                AI identifies $500k-$2M in cost savings through vendor consolidation and optimization.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Portfolio analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>AI cost savings identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Vendor performance tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Executive KPI dashboards</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                View Analytics <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          {/* Real-Time Collaboration */}
          <Link href="/team" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-yellow-500">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">Real-Time Collaboration</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                Google Docs-style editing with live cursors, comments, and track changes for contracts.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>Live multi-user editing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>Real-time cursors & selections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>Threaded comments with @mentions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">✓</span>
                  <span>Track changes workflow</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-yellow-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Collaborate Now <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          {/* Lifecycle Automation */}
          <Link href="/renewals" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-red-500">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">Lifecycle Automation</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                End-to-end automation from draft to approval to execution to renewal management.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Automated approval workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>AI obligation extraction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>90/60/30/7-day renewal alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✓</span>
                  <span>Performance tracking & SLAs</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-red-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Manage Lifecycle <span className="text-lg">→</span>
              </div>
            </div>
          </Link>

          {/* Template Library */}
          <Link href="/templates-enhanced" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-2 border-transparent hover:border-indigo-500">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <FileSignature className="w-8 h-8 text-white" />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">50+ Template Library</h3>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-xs font-bold">NEW</span>
              </div>
              <p className="text-gray-600 mb-6">
                Production-ready contracts across all industries - SaaS, Real Estate, Employment, Finance, Healthcare.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>50+ professional templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>10 industry categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>Lawyer-reviewed & certified</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>Variable customization</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Browse Templates <span className="text-lg">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                30s
              </div>
              <div className="text-gray-600">Contract creation time</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-600">Professional clauses</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                $2M
              </div>
              <div className="text-gray-600">Potential annual savings</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-600">Industry templates</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Contract Management?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Start drafting professional contracts in seconds with AI
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/drafting"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Try AI Drafting
            </Link>
            <Link
              href="/template-builder"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-lg border-2 border-white/20"
            >
              Build Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
