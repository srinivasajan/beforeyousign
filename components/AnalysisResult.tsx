'use client';

import { ContractAnalysis } from '@/lib/types';
import { AlertTriangle, CheckCircle, XCircle, Info, Download, TrendingUp, TrendingDown, Minus, Scale, FileText, MessageSquare, Send, X, Filter, Eye, EyeOff, Sparkles, Share2, Copy, Check, Link2, HelpCircle, Command, Bookmark, BookmarkCheck, StickyNote, Briefcase, Mail, Lightbulb, Loader2, Upload } from 'lucide-react';
import { clauseAlternatives } from '@/lib/templates-data';
import { useState, useRef, useEffect } from 'react';
import { useKeyboardShortcuts } from '@/lib/keyboard-shortcuts';

interface AnalysisResultProps {
  analysis: ContractAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'quick' | 'deep'>('quick');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high'>('all');
  const [showContractMap, setShowContractMap] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharePassword, setSharePassword] = useState('');
  const [shareExpiry, setShareExpiry] = useState(7);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [bookmarkedClauses, setBookmarkedClauses] = useState<Set<string>>(new Set());
  const [clauseNotes, setClauseNotes] = useState<Map<string, string>>(new Map());
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [selectedClauseForNegotiation, setSelectedClauseForNegotiation] = useState<string | null>(null);
  const [negotiationScript, setNegotiationScript] = useState<any>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [playbookContent, setPlaybookContent] = useState('');
  const [isGeneratingPlaybook, setIsGeneratingPlaybook] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'json' | 'html' | 'pdf'>('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeBookmarks: true,
    includeNotes: true,
    includeAIRecommendations: true,
    clauseFilter: 'all' as 'all' | 'bookmarked' | 'high-risk',
  });

  // Version comparison state
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareFile, setCompareFile] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Table of contents (sticky sidebar)
  const [showTOC, setShowTOC] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [isScrolling, setIsScrolling] = useState(false);
  const [showAllClauses, setShowAllClauses] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Scroll to section with smooth animation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsScrolling(true);
    setShowContractMap(false); // Close contract map when navigating
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Re-enable auto-tracking after scroll completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Don't update active section while user is manually scrolling via click
      if (isScrolling) return;

      const sections = ['summary', 'red-flags', 'clauses'];
      // Add all clause IDs
      for (let i = 0; i < analysis.clauses.length; i++) {
        sections.push(`clause-${i}`);
      }
      sections.push('recommendations', 'alternatives');
      
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling, analysis.clauses.length]);

  // Generate contract ID for bookmarks
  const contractId = `${analysis.metadata.fileName}-${Date.now()}`.replace(/[^a-zA-Z0-9-]/g, '_');

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      description: 'Open Contract Map',
      action: () => setShowContractMap(true),
    },
    {
      key: 'm',
      ctrl: true,
      description: 'Toggle Chat',
      action: () => setShowChat(prev => !prev),
    },
    {
      key: 'Escape',
      description: 'Close Overlays',
      action: () => {
        setShowContractMap(false);
        setShowChat(false);
        setShowShareModal(false);
        setShowShortcuts(false);
      },
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show Shortcuts',
      action: () => setShowShortcuts(prev => !prev),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Toggle Sidebar',
      action: () => setShowTOC(prev => !prev),
    },
    {
      key: '1',
      description: 'Quick View',
      action: () => setViewMode('quick'),
    },
    {
      key: '2',
      description: 'Deep Dive',
      action: () => setViewMode('deep'),
    },
    {
      key: '3',
      description: 'All Risks',
      action: () => setRiskFilter('all'),
    },
    {
      key: '4',
      description: 'Critical Only',
      action: () => setRiskFilter('critical'),
    },
    {
      key: '5',
      description: 'High & Critical',
      action: () => setRiskFilter('high'),
    },
  ]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            summary: analysis.summary,
            riskScore: analysis.riskScore,
            redFlags: analysis.redFlags.map(f => ({ title: f.title, severity: f.severity })),
            clauses: analysis.clauses.map(c => ({ title: c.title, riskLevel: c.riskLevel, plainLanguage: c.plainLanguage }))
          }
        })
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          expiresInDays: shareExpiry,
          password: sharePassword || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShareUrl(data.shareUrl);
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('✓ Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      showToast('⚠️ Failed to copy link', 'error');
    }
  };

  const toggleBookmark = (clauseTitle: string) => {
    setBookmarkedClauses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clauseTitle)) {
        newSet.delete(clauseTitle);
        // Remove note too
        setClauseNotes(prevNotes => {
          const newNotes = new Map(prevNotes);
          newNotes.delete(clauseTitle);
          return newNotes;
        });
      } else {
        newSet.add(clauseTitle);
      }
      return newSet;
    });
  };

  const updateClauseNote = (clauseTitle: string, note: string) => {
    setClauseNotes(prev => {
      const newMap = new Map(prev);
      newMap.set(clauseTitle, note);
      return newMap;
    });
  };

  const exportBookmarks = (format: 'json' | 'markdown') => {
    const bookmarkedClausesList = analysis.clauses.filter(c => 
      bookmarkedClauses.has(c.title)
    );

    if (bookmarkedClausesList.length === 0) {
      showToast('⚠️ No bookmarks to export', 'error');
      return;
    }

    try {
      if (format === 'json') {
        const data = {
          contractName: analysis.metadata.fileName,
          exportedAt: new Date().toISOString(),
          bookmarksCount: bookmarkedClausesList.length,
          bookmarks: bookmarkedClausesList.map(c => ({
            title: c.title,
            originalText: c.originalText,
            plainLanguage: c.plainLanguage,
            riskLevel: c.riskLevel,
            note: clauseNotes.get(c.title) || '',
          })),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        a.download = `bookmarks-${timestamp}-${analysis.metadata.fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`✓ Exported ${bookmarkedClausesList.length} bookmarks as JSON`, 'success');
    } else {
      let markdown = `# Bookmarked Clauses - ${analysis.metadata.fileName}\n\n`;
      markdown += `*Exported: ${new Date().toLocaleString()}*\n\n---\n\n`;
      
      bookmarkedClausesList.forEach((clause, i) => {
        markdown += `## ${i + 1}. ${clause.title}\n\n`;
        markdown += `**Risk Level:** ${clause.riskLevel.toUpperCase()}\n\n`;
        markdown += `**Original Text:**\n\n${clause.originalText}\n\n`;
        markdown += `**Plain Language:**\n\n${clause.plainLanguage}\n\n`;
        
        const note = clauseNotes.get(clause.title);
        if (note) {
          markdown += `**My Notes:**\n\n${note}\n\n`;
        }
        
        markdown += `---\n\n`;
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `bookmarks-${timestamp}-${analysis.metadata.fileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`✓ Exported ${bookmarkedClausesList.length} bookmarks as Markdown`, 'success');
      }
    } catch (error) {
      console.error('Bookmark export error:', error);
      showToast('⚠️ Failed to export bookmarks', 'error');
    }
  };

  const generateNegotiationScript = async (clauseTitle: string) => {
    const clause = analysis.clauses.find(c => c.title === clauseTitle);
    if (!clause) return;

    setSelectedClauseForNegotiation(clauseTitle);
    setIsGeneratingScript(true);
    setShowNegotiationModal(true);
    setNegotiationScript(null);

    try {
      const response = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clause,
          contractContext: `Contract: ${analysis.metadata.fileName}, Risk Score: ${analysis.riskScore}/100`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.script) {
        setNegotiationScript(data.script);
      } else {
        throw new Error(data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating script:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setNegotiationScript({
        emailTemplate: `⚠️ Error generating negotiation script\n\n${errorMessage}\n\nPlease check your API configuration and try again.`,
        talkingPoints: [],
        strategies: [],
        alternativeLanguage: ''
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateFullPlaybook = async () => {
    // Validate there are clauses to negotiate
    const highRiskClauses = analysis.clauses.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high');
    if (highRiskClauses.length === 0) {
      alert('✓ Good news! This contract has no critical or high-risk clauses.\n\nThe negotiation playbook focuses on the most concerning clauses.');
      return;
    }

    setIsGeneratingPlaybook(true);
    setShowPlaybookModal(true);
    setPlaybookContent('');

    try {
      const response = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.playbook) {
        setPlaybookContent(data.playbook);
      } else {
        throw new Error(data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating playbook:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPlaybookContent(`# ⚠️ Failed to Generate Playbook\n\n**Error:** ${errorMessage}\n\n**Possible causes:**\n- API rate limits reached\n- Network connectivity issues\n- Invalid API key configuration\n\n**Solution:** Please check your .env.local file and try again in a few moments.`);
    } finally {
      setIsGeneratingPlaybook(false);
    }
  };

  const downloadPlaybook = () => {
    try {
      if (!playbookContent) {
        showToast('⚠️ No playbook content to download', 'error');
        return;
      }
      const blob = new Blob([playbookContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `playbook-${timestamp}-${analysis.metadata.fileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✓ Playbook downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showToast('⚠️ Failed to download playbook', 'error');
    }
  };

  const handleEnhancedExport = async () => {
    try {
      const { exportAsMarkdown, exportAsJSON, exportAsHTML, exportAsPDFHTML } = await import('@/lib/enhanced-export');
      
      let content: string;
      let mimeType: string;
      let extension: string;

      const fullOptions = { ...exportOptions, format: exportFormat };

      if (exportFormat === 'markdown') {
        content = exportAsMarkdown(analysis, clauseNotes, fullOptions);
        mimeType = 'text/markdown';
        extension = 'md';
      } else if (exportFormat === 'json') {
        content = exportAsJSON(analysis, clauseNotes, fullOptions);
        mimeType = 'application/json';
        extension = 'json';
      } else if (exportFormat === 'pdf') {
        content = exportAsPDFHTML(analysis, clauseNotes, fullOptions);
        mimeType = 'text/html';
        extension = 'html';
      } else {
        content = exportAsHTML(analysis, clauseNotes, fullOptions);
        mimeType = 'text/html';
        extension = 'html';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `analysis-${timestamp}-${analysis.metadata.fileName}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast(`\u2713 Successfully exported as ${exportFormat.toUpperCase()}`, 'success');
      // Close modal after successful export
      setTimeout(() => setShowExportModal(false), 400);
    } catch (error) {
      console.error('Export error:', error);
      showToast('\u26a0\ufe0f Failed to export analysis', 'error');
    }
  };

  const handleCompareVersions = async () => {
    if (!compareFile) return;

    setIsComparing(true);
    try {
      const formData = new FormData();
      formData.append('file', compareFile);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze comparison file');
      }

      const newAnalysis = await response.json();
      
      if (!newAnalysis || !newAnalysis.clauses) {
        throw new Error('Invalid analysis result from server');
      }

      const { compareContracts } = await import('@/lib/version-compare');
      
      const comparison = compareContracts(analysis, newAnalysis);
      setComparisonResult(comparison);
      showToast('✓ Version comparison complete!', 'success');
    } catch (error) {
      console.error('Comparison error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to compare versions';
      showToast(`⚠️ ${errorMessage}`, 'error');
      setComparisonResult(null);
      setCompareFile(null);
    } finally {
      setIsComparing(false);
    }
  };

  const filteredRedFlags = analysis.redFlags.filter(flag => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'critical') return flag.severity === 'critical';
    if (riskFilter === 'high') return flag.severity === 'critical' || flag.severity === 'danger';
    return true;
  });

  const filteredClauses = analysis.clauses.filter(clause => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'critical') return clause.riskLevel === 'critical';
    if (riskFilter === 'high') return clause.riskLevel === 'critical' || clause.riskLevel === 'high';
    return true;
  });

  const criticalCount = analysis.clauses.filter(c => c.riskLevel === 'critical').length;
  const highCount = analysis.clauses.filter(c => c.riskLevel === 'high').length;
  const mediumCount = analysis.clauses.filter(c => c.riskLevel === 'medium').length;

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
    <div className="w-full min-h-screen">
      {/* Main Content Wrapper with Sidebar Spacing */}
      <div className={`transition-all duration-300 ease-in-out ${showTOC ? 'xl:ml-72' : 'xl:ml-0'}`}>
        <div className="space-y-8 animate-fade-in relative">
      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Command className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setShowShortcuts(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close shortcuts">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Open Contract Map</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">Ctrl+K</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Toggle Chat</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">Ctrl+M</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Toggle Sidebar</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">Ctrl+B</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Close Overlays</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">Esc</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Quick View Mode</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">1</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Deep Dive Mode</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">2</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Show All Risks</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">3</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-200">
                <span className="text-stone-700">Critical Only</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">4</kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-700">High & Critical</span>
                <kbd className="px-3 py-1 bg-stone-100 border border-stone-300 rounded text-sm font-mono">5</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Share Analysis</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close share modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!shareUrl ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="share-password" className="block text-sm font-semibold text-stone-700 mb-2">
                    Password Protection (Optional)
                  </label>
                  <input
                    id="share-password"
                    type="password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="Leave empty for no password"
                    className="w-full px-4 py-2 border-2 border-stone-300 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="share-expiry" className="block text-sm font-semibold text-stone-700 mb-2">
                    Link Expires In
                  </label>
                  <select
                    id="share-expiry"
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-stone-300 focus:border-stone-900 focus:outline-none"
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>

                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full bg-stone-900 text-white py-3 font-semibold hover:bg-stone-800 disabled:bg-stone-400 transition-colors"
                >
                  {isSharing ? 'Creating Link...' : 'Generate Share Link'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-stone-50 p-4 border-2 border-stone-200 rounded">
                  <label htmlFor="share-url-display" className="block text-xs text-stone-500 uppercase tracking-wider mb-2">Share Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="share-url-display"
                      type="text"
                      value={shareUrl}
                      readOnly
                      aria-label="Shareable link URL"
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 text-sm font-mono"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-2"
                      aria-label="Copy link to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Link expires in {shareExpiry} day{shareExpiry > 1 ? 's' : ''}</p>
                      {sharePassword && <p>Password protection is enabled</p>}
                      <p className="mt-2">Anyone with this link can view the analysis.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShareUrl('');
                    setSharePassword('');
                  }}
                  className="w-full border-2 border-stone-300 text-stone-900 py-3 font-semibold hover:border-stone-900 transition-colors"
                >
                  Create Another Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowBookmarks(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookmarkCheck className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Bookmarked Clauses ({bookmarkedClauses.size})</h3>
              </div>
              <button onClick={() => setShowBookmarks(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close bookmarks">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookmarkedClauses.size === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-medium mb-2">No bookmarks yet</p>
                <p className="text-sm text-stone-400">Click the bookmark icon on any clause to save it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysis.clauses.filter(c => bookmarkedClauses.has(c.title)).map((clause) => (
                  <div key={clause.title} className="border-2 border-stone-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-stone-900">{clause.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        clause.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                        clause.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                        clause.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {clause.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 mb-3">{clause.plainLanguage}</p>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-stone-700">My Notes:</label>
                      <textarea
                        value={clauseNotes.get(clause.title) || ''}
                        onChange={(e) => updateClauseNote(clause.title, e.target.value)}
                        placeholder="Add your notes here..."
                        className="w-full px-3 py-2 border border-stone-300 text-sm focus:border-stone-900 focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-3 pt-4 border-t-2 border-stone-200">
                  <button
                    onClick={() => exportBookmarks('json')}
                    className="flex-1 bg-stone-900 text-white py-3 font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => exportBookmarks('markdown')}
                    className="flex-1 border-2 border-stone-900 text-stone-900 py-3 font-semibold hover:bg-stone-900 hover:text-white transition-colors"
                  >
                    Export as Markdown
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Negotiation Script Modal */}
      {showNegotiationModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowNegotiationModal(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Negotiation Script</h3>
              </div>
              <button onClick={() => setShowNegotiationModal(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingScript ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-stone-400 animate-spin mx-auto mb-4" />
                <p className="text-stone-500 font-medium">Generating negotiation strategy...</p>
                <p className="text-sm text-stone-400 mt-2">This may take 10-15 seconds</p>
              </div>
            ) : negotiationScript ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 p-4 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-indigo-900">Priority: {negotiationScript.priorityLevel}</span>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-3">
                    <Mail className="w-5 h-5" />
                    Email Template
                  </h4>
                  <div className="bg-stone-50 border border-stone-300 p-4 rounded">
                    <pre className="whitespace-pre-wrap text-sm text-stone-700 font-sans">{negotiationScript.emailTemplate}</pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(negotiationScript.emailTemplate);
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Copy Email Template
                  </button>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-stone-900 mb-3">💬 Talking Points</h4>
                  <ul className="space-y-2">
                    {negotiationScript.talkingPoints.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-stone-700">
                        <span className="font-bold text-indigo-600">{i + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-stone-900 mb-3">🎯 Negotiation Strategies</h4>
                  <ul className="space-y-2">
                    {negotiationScript.negotiationStrategies.map((strategy: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-stone-700">
                        <span className="font-bold text-purple-600">•</span>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-stone-900 mb-3">✏️ Suggested Alternative Language</h4>
                  <div className="bg-green-50 border border-green-300 p-4 rounded">
                    <p className="text-sm text-stone-700 whitespace-pre-wrap">{negotiationScript.alternativeLanguage}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const fullContent = `# Negotiation Script\n\nPriority: ${negotiationScript.priorityLevel}\n\n## Email Template\n\n${negotiationScript.emailTemplate}\n\n## Talking Points\n\n${negotiationScript.talkingPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}\n\n## Strategies\n\n${negotiationScript.negotiationStrategies.map((s: string) => `- ${s}`).join('\n')}\n\n## Alternative Language\n\n${negotiationScript.alternativeLanguage}`;
                    const blob = new Blob([fullContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `negotiation-${selectedClauseForNegotiation?.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
                    a.click();
                  }}
                  className="w-full bg-stone-900 text-white py-3 font-semibold hover:bg-stone-800 transition-colors"
                >
                  Download Script
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-stone-500 font-medium">Failed to generate script</p>
                <p className="text-sm text-stone-400 mt-2">Please try again</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Negotiation Playbook Modal */}
      {showPlaybookModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowPlaybookModal(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Complete Negotiation Playbook</h3>
              </div>
              <button onClick={() => setShowPlaybookModal(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingPlaybook ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-stone-400 animate-spin mx-auto mb-4" />
                <p className="text-stone-500 font-medium">Generating comprehensive playbook...</p>
                <p className="text-sm text-stone-400 mt-2">This may take 30-60 seconds for critical clauses</p>
              </div>
            ) : playbookContent ? (
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-300 p-6 rounded max-h-[50vh] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-stone-700 font-sans">{playbookContent}</pre>
                </div>
                <button
                  onClick={downloadPlaybook}
                  className="w-full bg-stone-900 text-white py-3 font-semibold hover:bg-stone-800 transition-colors"
                >
                  Download Playbook
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-stone-500 font-medium">Failed to generate playbook</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
          <div className="bg-white border-2 border-stone-900 p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-stone-900" />
                <h3 className="text-2xl font-bold text-stone-900">Enhanced Export</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="hover:bg-stone-100 p-2 rounded" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Export Format</label>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`py-3 px-4 border-2 font-semibold transition-colors ${
                      exportFormat === 'pdf'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    📄 PDF
                  </button>
                  <button
                    onClick={() => setExportFormat('markdown')}
                    className={`py-3 px-4 border-2 font-semibold transition-colors ${
                      exportFormat === 'markdown'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    📝 Markdown
                  </button>
                  <button
                    onClick={() => setExportFormat('json')}
                    className={`py-3 px-4 border-2 font-semibold transition-colors ${
                      exportFormat === 'json'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    📊 JSON
                  </button>
                  <button
                    onClick={() => setExportFormat('html')}
                    className={`py-3 px-4 border-2 font-semibold transition-colors ${
                      exportFormat === 'html'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    🌐 HTML
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Content Options</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-stone-300 rounded hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeBookmarks}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeBookmarks: e.target.checked }))}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">Include Bookmarks</div>
                      <div className="text-sm text-stone-600">Highlight bookmarked clauses in export</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-stone-300 rounded hover:bg-stone-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeNotes}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                      className="w-5 h-5"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">Include Notes</div>
                      <div className="text-sm text-stone-600">Add your personal notes to clauses</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-3">Clause Filter</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setExportOptions(prev => ({ ...prev, clauseFilter: 'all' }))}
                    className={`py-3 px-4 border-2 font-semibold text-sm transition-colors ${
                      exportOptions.clauseFilter === 'all'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    All Clauses
                  </button>
                  <button
                    onClick={() => setExportOptions(prev => ({ ...prev, clauseFilter: 'bookmarked' }))}
                    className={`py-3 px-4 border-2 font-semibold text-sm transition-colors ${
                      exportOptions.clauseFilter === 'bookmarked'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    Bookmarked
                  </button>
                  <button
                    onClick={() => setExportOptions(prev => ({ ...prev, clauseFilter: 'high-risk' }))}
                    className={`py-3 px-4 border-2 font-semibold text-sm transition-colors ${
                      exportOptions.clauseFilter === 'high-risk'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-900'
                    }`}
                  >
                    High Risk
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  handleEnhancedExport();
                  setShowExportModal(false);
                }}
                className="w-full bg-stone-900 text-white py-4 font-bold text-lg hover:bg-stone-800 transition-colors"
              >
                Export as {exportFormat.toUpperCase()}
              </button>

              <p className="text-xs text-stone-500 text-center">
                {exportFormat === 'pdf' && 'Professional PDF report with AI recommendations - ready to print or share'}
                {exportFormat === 'markdown' && 'Perfect for documentation and sharing with teams'}
                {exportFormat === 'json' && 'Machine-readable format for integration and backup'}
                {exportFormat === 'html' && 'Styled report ready for viewing in any browser'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <button
          onClick={() => setShowChat(!showChat)}
          className="group bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 relative"
          title="Ask questions about this contract (Ctrl+M)"
        >
          <MessageSquare className="w-6 h-6" />
          {chatMessages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {chatMessages.length}
            </span>
          )}
          <kbd className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            M
          </kbd>
        </button>
        <button
          onClick={() => setShowContractMap(!showContractMap)}
          className="group bg-purple-600 text-white p-4 rounded-full shadow-2xl hover:bg-purple-700 transition-all duration-300 hover:scale-110 relative"
          title="View Contract Map (Ctrl+K)"
        >
          <Sparkles className="w-6 h-6" />
          <kbd className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            K
          </kbd>
        </button>
        <button
          onClick={() => setShowShortcuts(true)}
          className="group bg-stone-700 text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-all duration-300 hover:scale-110 relative"
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <HelpCircle className="w-6 h-6" />
          <kbd className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ?
          </kbd>
        </button>
        <button
          onClick={() => setShowBookmarks(true)}
          className="group bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-all duration-300 hover:scale-110 relative"
          title="View Bookmarks (B)"
        >
          <BookmarkCheck className="w-6 h-6" />
          {bookmarkedClauses.size > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {bookmarkedClauses.size}
            </span>
          )}
          <kbd className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            B
          </kbd>
        </button>
      </div>

      {/* AI Chat Sidebar */}
      {showChat && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-white border-l-2 border-stone-900 shadow-2xl z-40 flex flex-col animate-slide-in">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Contract Assistant</h3>
              <p className="text-indigo-100 text-sm">Ask anything about this contract</p>
            </div>
            <button 
              onClick={() => setShowChat(false)} 
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 font-medium mb-2">No messages yet</p>
                <p className="text-sm text-stone-400 px-4">Try asking:<br/>"What are my biggest risks?"<br/>"Explain the termination clause"</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white border border-stone-200 text-stone-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce bounce-delay-0"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce bounce-delay-150"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce bounce-delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 border-t border-stone-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about clauses, risks, or alternatives..."
                className="flex-1 px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !chatInput.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Contract Map Overlay */}
      {showContractMap && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 overflow-auto">
          <button
            onClick={() => setShowContractMap(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all z-10"
            aria-label="Close contract map"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-7xl mx-auto p-12">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4">Contract Intelligence Map</h2>
              <p className="text-purple-200 text-lg">Click any node to navigate to that section</p>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-12">
              {/* Risk Score Card */}
              <div 
                onClick={() => scrollToSection('summary')}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <div className="text-white/80 text-sm uppercase tracking-wider mb-2">Overall Risk</div>
                <div className="text-6xl font-bold text-white mb-2">{analysis.riskScore}</div>
                <div className="text-purple-100">{getRiskLabel(analysis.riskScore)}</div>
              </div>

              {/* Red Flags Card */}
              <div 
                onClick={() => scrollToSection('red-flags')}
                className="bg-gradient-to-br from-red-500 to-orange-600 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <div className="text-white/80 text-sm uppercase tracking-wider mb-2">Critical Issues</div>
                <div className="text-6xl font-bold text-white mb-2">{analysis.redFlags.length}</div>
                <div className="text-red-100">Flagged for Review</div>
              </div>

              {/* Clauses Card */}
              <div 
                onClick={() => scrollToSection('clauses')}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 p-8 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <div className="text-white/80 text-sm uppercase tracking-wider mb-2">Provisions</div>
                <div className="text-6xl font-bold text-white mb-2">{analysis.clauses.length}</div>
                <div className="text-blue-100">Clauses Analyzed</div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Risk Distribution</h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">{criticalCount}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">{highCount}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">High</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">{mediumCount}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{analysis.clauses.length - criticalCount - highCount - mediumCount}</div>
                  <div className="text-white/70 text-sm uppercase tracking-wider">Low</div>
                </div>
              </div>
            </div>

            {/* Clause Categories */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {analysis.redFlags.map((flag, idx) => (
                <div
                  key={flag.id}
                  onClick={() => scrollToSection('red-flags')}
                  className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-lg border border-red-500/30 p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{flag.title}</h4>
                      <p className="text-red-200 text-sm">{flag.severity.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Table of Contents Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-stone-50 to-white border-r-2 border-stone-200 shadow-xl z-40 transition-transform duration-300 ease-in-out ${
        showTOC ? 'translate-x-0' : '-translate-x-full'
      } hidden xl:block`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b-2 border-stone-200 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-900 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-lg">Contents</h3>
                  <p className="text-xs text-stone-500">Quick Navigation</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <button
              onClick={() => scrollToSection('summary')}
              className={`group w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                activeSection === 'summary' 
                  ? 'bg-stone-900 text-white' 
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full transition-colors duration-150 ${activeSection === 'summary' ? 'bg-white' : 'bg-stone-400 group-hover:bg-stone-600'}`} />
                <span className="text-sm font-medium">Executive Summary</span>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('red-flags')}
              className={`group w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                activeSection === 'red-flags' 
                  ? 'bg-stone-900 text-white' 
                  : 'hover:bg-red-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full transition-colors duration-150 ${activeSection === 'red-flags' ? 'bg-white' : 'bg-red-400 group-hover:bg-red-500'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">Red Flags</div>
                  <div className={`text-xs transition-colors duration-150 ${activeSection === 'red-flags' ? 'text-red-200' : 'text-stone-500'}`}>
                    {analysis.redFlags.length} critical issues
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('clauses')}
              className={`group w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                activeSection === 'clauses' 
                  ? 'bg-stone-900 text-white' 
                  : 'hover:bg-blue-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full transition-colors duration-150 ${activeSection === 'clauses' ? 'bg-white' : 'bg-blue-400 group-hover:bg-blue-500'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">All Clauses</div>
                  <div className={`text-xs transition-colors duration-150 ${activeSection === 'clauses' ? 'text-blue-200' : 'text-stone-500'}`}>
                    {analysis.clauses.length} provisions
                  </div>
                </div>
              </div>
            </button>

            {/* Nested Clause Items */}
            <div className="pl-8 space-y-1 mt-2 mb-2 border-l-2 border-stone-200 ml-4">
              {(showAllClauses ? analysis.clauses : analysis.clauses.slice(0, 8)).map((clause, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    scrollToSection(`clause-${idx}`);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs rounded-md transition-all duration-200 ${
                    activeSection === `clause-${idx}`
                      ? 'bg-stone-800 text-white font-semibold shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 hover:pl-4'
                  }`}
                  title={clause.title}
                >
                  <span className="opacity-60 mr-2">└</span>{clause.title}
                </button>
              ))}
              {analysis.clauses.length > 8 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllClauses(!showAllClauses);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200 font-semibold hover:pl-4"
                >
                  {showAllClauses ? '▲ Show Less' : `▼ Show ${analysis.clauses.length - 8} More Clauses`}
                </button>
              )}
            </div>

            <button
              onClick={() => scrollToSection('recommendations')}
              className={`group w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                activeSection === 'recommendations' 
                  ? 'bg-stone-900 text-white' 
                  : 'hover:bg-green-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full transition-colors duration-150 ${activeSection === 'recommendations' ? 'bg-white' : 'bg-green-400 group-hover:bg-green-500'}`} />
                <span className="text-sm font-medium">Recommendations</span>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('alternatives')}
              className={`group w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                activeSection === 'alternatives' 
                  ? 'bg-stone-900 text-white' 
                  : 'hover:bg-purple-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full transition-colors duration-150 ${activeSection === 'alternatives' ? 'bg-white' : 'bg-purple-400 group-hover:bg-purple-500'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">Fair Alternatives</div>
                  <div className={`text-xs transition-colors duration-150 ${activeSection === 'alternatives' ? 'text-purple-200' : 'text-stone-500'}`}>
                    {clauseAlternatives.length} community options
                  </div>
                </div>
              </div>
            </button>
          </nav>

          {/* Footer with Toggle */}
          <div className="p-4 border-t-2 border-stone-200 bg-white">
            <button
              onClick={() => setShowTOC(false)}
              className="w-full px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Hide Sidebar
            </button>
          </div>
        </div>
      </div>

      {/* TOC Toggle Button (when hidden) - Now a tab on the edge */}
      {!showTOC && (
        <button
          onClick={() => setShowTOC(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-stone-900 text-white px-2 py-6 rounded-r-lg shadow-2xl z-40 hover:bg-stone-800 transition-all hover:px-3 hidden xl:flex flex-col items-center gap-2 group"
          aria-label="Show table of contents"
        >
          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs writing-mode-vertical transform rotate-180 font-semibold tracking-wider">CONTENTS</span>
        </button>
      )}

      {/* View Mode Toggle & Filters */}
      <div className="bg-white border-2 border-stone-900 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">View Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('quick')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'quick' 
                  ? 'bg-stone-900 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Quick View
            </button>
            <button
              onClick={() => setViewMode('deep')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'deep' 
                  ? 'bg-stone-900 text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <EyeOff className="w-4 h-4 inline mr-2" />
              Deep Dive
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
            <Filter className="w-4 h-4 inline mr-2" />
            Risk Filter:
          </span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as 'all' | 'critical' | 'high')}
            className="px-4 py-2 border-2 border-stone-300 bg-white text-stone-900 font-medium focus:outline-none focus:border-stone-900"
            aria-label="Filter by risk level"
          >
            <option value="all">All Risks</option>
            <option value="critical">Critical Only</option>
            <option value="high">High & Critical</option>
          </select>
        </div>
      </div>

      {/* Header with Risk Score */}
      <div id="summary" className="bg-white border-2 border-stone-900 p-10">
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-stone-900"></div>
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Analysis Report</span>
            </div>
            <h2 className="text-5xl font-bold text-stone-900 mb-3">Executive Analysis</h2>
            <p className="text-sm text-stone-500 mono tracking-wide">{analysis.metadata.fileName}</p>
          </div>
          <div className="flex flex-wrap gap-3 no-print">
            <button
              onClick={() => setShowCompareModal(true)}
              className="group flex items-center gap-2 px-5 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
              title="Compare with another version"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="font-medium">Compare Versions</span>
            </button>
            <button
              onClick={generateFullPlaybook}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              title="Generate negotiation playbook for all critical clauses"
            >
              <Briefcase className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Negotiation Playbook</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="group flex items-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300"
              title="Share this analysis"
            >
              <Share2 className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-all duration-300"
              title="Enhanced export with annotations"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Export</span>
            </button>
          </div>
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

        {/* AI Confidence & Transparency */}
        {analysis.confidence && (
          <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Analysis Confidence & Transparency</h4>
                </div>
                <p className="text-sm text-indigo-700">
                  Powered by <span className="font-semibold">{analysis.confidence.model}</span> • 
                  Last updated {new Date(analysis.confidence.analysisDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-900 mb-1">{analysis.confidence.overall}%</div>
                <div className="text-xs text-indigo-600 uppercase tracking-wider">Overall Confidence</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/60 p-4 rounded">
                <div className="text-xs text-indigo-600 uppercase tracking-wider mb-1">Risk Score Accuracy</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-500 confidence-bar" data-width={analysis.confidence.riskScoreConfidence}></div>
                  </div>
                  <span className="text-sm font-bold text-indigo-900">{analysis.confidence.riskScoreConfidence}%</span>
                </div>
              </div>
              <div className="bg-white/60 p-4 rounded">
                <div className="text-xs text-indigo-600 uppercase tracking-wider mb-1">Clause Analysis Accuracy</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-500 confidence-bar" data-width={analysis.confidence.clauseAnalysisConfidence}></div>
                  </div>
                  <span className="text-sm font-bold text-indigo-900">{analysis.confidence.clauseAnalysisConfidence}%</span>
                </div>
              </div>
            </div>

            {analysis.confidence.notes && analysis.confidence.notes.length > 0 && (
              <div className="border-t border-indigo-200 pt-4">
                <p className="text-xs text-indigo-700 uppercase tracking-wider font-bold mb-2">Analysis Notes</p>
                <ul className="space-y-1">
                  {analysis.confidence.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-indigo-800 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="border-l-2 border-stone-900 pl-8 bg-stone-50/50 p-6 -mx-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Executive Summary</h3>
            <div className="h-px flex-1 bg-stone-200"></div>
          </div>
          <p className="text-stone-700 leading-relaxed text-lg font-light">{analysis.summary}</p>
        </div>
      </div>

      {/* Red Flags Section */}
      {filteredRedFlags.length > 0 && (
        <div id="red-flags" className="bg-white border-2 border-stone-900 p-10">
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
            {filteredRedFlags.slice(0, viewMode === 'quick' ? 3 : undefined).map((flag, index) => (
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
      <div id="clauses" className="bg-white border-2 border-stone-900 p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-stone-200">
          <h3 className="text-3xl font-bold text-stone-900">
            Detailed Provision Analysis
          </h3>
          {viewMode === 'quick' && filteredClauses.length > 5 && (
            <button
              onClick={() => setViewMode('deep')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
            >
              Show all {filteredClauses.length} clauses
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-8">
          {filteredClauses.slice(0, viewMode === 'quick' ? 5 : undefined).map((clause, index) => (
            <div
              key={clause.id}
              id={`clause-${index}`}
              className="border-t border-stone-200 pt-6 first:border-0 first:pt-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-stone-400 font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="text-xl font-bold text-stone-900">{clause.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(clause.title)}
                    className={`p-2 rounded transition-colors ${
                      bookmarkedClauses.has(clause.title)
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600'
                    }`}
                    title={bookmarkedClauses.has(clause.title) ? 'Remove bookmark' : 'Bookmark this clause'}
                  >
                    {bookmarkedClauses.has(clause.title) ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  {(clause.riskLevel === 'critical' || clause.riskLevel === 'high') && (
                    <button
                      onClick={() => generateNegotiationScript(clause.title)}
                      className="p-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                      title="Generate negotiation script"
                    >
                      <Briefcase className="w-4 h-4" />
                    </button>
                  )}
                  <span className={`text-xs px-3 py-1 uppercase font-semibold tracking-wider ${
                    clause.riskLevel === 'critical' ? 'bg-stone-900 text-white' :
                    clause.riskLevel === 'high' ? 'bg-stone-700 text-white' :
                    clause.riskLevel === 'medium' ? 'bg-stone-400 text-white' :
                    'bg-stone-200 text-stone-900'
                  }`}>
                    {clause.riskLevel}
                  </span>
                </div>
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

              {/* Industry Benchmark Comparison */}
              {clause.industryComparison && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-900 uppercase tracking-wider font-bold">Industry Benchmark Analysis</p>
                  </div>
                  
                  {/* Strictness Meter */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-900 font-medium">Strictness Level</span>
                      <span className="mono text-sm font-bold text-blue-900">{clause.industryComparison.averageStrictness}/100</span>
                    </div>
                    <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className={`strictness-bar absolute left-0 top-0 h-full transition-all duration-500 ${
                          clause.industryComparison.averageStrictness > 70 ? 'bg-red-600' :
                          clause.industryComparison.averageStrictness > 50 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        data-width={clause.industryComparison.averageStrictness}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {clause.industryComparison.averageStrictness > 60 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-700 font-medium">
                            {clause.industryComparison.averageStrictness > 70 ? 
                              `${Math.round((clause.industryComparison.averageStrictness - 50) / 25)}x stricter than industry average` :
                              'Above industry average'}
                          </span>
                        </>
                      ) : clause.industryComparison.averageStrictness < 40 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">More favorable than industry average</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-700 font-medium">Within industry standard range</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Percentile Ranking */}
                  <div className="mb-5 flex items-center gap-3 p-3 bg-white/60 rounded">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="mono text-lg font-bold text-white">{clause.industryComparison.percentile}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 uppercase tracking-wider font-semibold">Percentile Rank</p>
                      <p className="text-sm text-blue-900">
                        Stricter than <span className="font-bold">{clause.industryComparison.percentile}%</span> of similar contracts
                      </p>
                    </div>
                  </div>

                  {/* Fairer Alternative */}
                  {clause.industryComparison.fairerVersion && (
                    <div className="border-t border-blue-200 pt-4">
                      <p className="text-xs text-blue-700 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        Recommended Balanced Alternative
                      </p>
                      <p className="text-sm text-blue-900 leading-relaxed bg-white/80 p-4 rounded italic border-l-2 border-blue-600">
                        "{clause.industryComparison.fairerVersion}"
                      </p>
                    </div>
                  )}

                  {/* Common Alternatives */}
                  {clause.industryComparison.commonAlternatives && clause.industryComparison.commonAlternatives.length > 0 && (
                    <div className="border-t border-blue-200 pt-4 mt-4">
                      <p className="text-xs text-blue-700 uppercase tracking-wider font-bold mb-3">Common Industry Alternatives</p>
                      <ul className="space-y-2">
                        {clause.industryComparison.commonAlternatives.map((alt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

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
        <div id="recommendations" className="bg-white border-2 border-stone-900 p-8">
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

      {/* Clause Marketplace - Community Alternatives */}
      <div id="alternatives" className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 p-10">
        <div className="mb-8 pb-6 border-b border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-purple-600"></div>
            <span className="mono text-xs text-purple-600 tracking-wider uppercase font-bold">Clause Marketplace</span>
          </div>
          <h3 className="text-4xl font-bold text-purple-900 mb-2">
            Community-Vetted Fair Alternatives
          </h3>
          <p className="text-purple-700 font-light leading-relaxed">
            See how others have negotiated fairer terms. These alternatives are ranked by legal experts and the community.
          </p>
        </div>

        <div className="space-y-6">
          {clauseAlternatives.slice(0, 3).map((alternative) => (
            <div key={alternative.id} className="bg-white border border-purple-200 p-6 rounded-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 text-xs uppercase font-bold tracking-wider rounded-full ${
                    alternative.source === 'expert' ? 'bg-purple-600 text-white' :
                    alternative.source === 'legal_standard' ? 'bg-blue-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {alternative.source === 'expert' ? '⚖️ Expert' : 
                     alternative.source === 'legal_standard' ? '📚 Legal Standard' : 
                     '👥 Community'}
                  </div>
                  <span className="text-sm text-purple-600 font-medium">
                    {alternative.votes.toLocaleString()} upvotes
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-red-700 uppercase tracking-wider font-bold mb-2">❌ Original (Unfair)</p>
                  <p className="text-sm text-stone-700 italic bg-red-50 border-l-4 border-red-400 p-3 leading-relaxed">
                    "{alternative.originalClause}"
                  </p>
                </div>

                <div>
                  <p className="text-xs text-green-700 uppercase tracking-wider font-bold mb-2">✓ Fairer Alternative</p>
                  <p className="text-sm text-stone-900 font-medium bg-green-50 border-l-4 border-green-500 p-3 leading-relaxed">
                    "{alternative.fairerVersion}"
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                  <p className="text-xs text-purple-900 uppercase tracking-wider font-bold mb-2">Why This Is Better</p>
                  <p className="text-sm text-purple-800 leading-relaxed">{alternative.explanation}</p>
                  {alternative.contributor && (
                    <p className="text-xs text-purple-600 mt-3 italic">— {alternative.contributor}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors duration-300">
            <FileText className="w-5 h-5" />
            Browse All {clauseAlternatives.length} Fair Alternatives
          </button>
        </div>
      </div>

      {/* Version Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => !isComparing && setShowCompareModal(false)}>
          <div className="bg-white border-2 border-stone-900 max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b-2 border-stone-900 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Compare Contract Versions
                </h3>
                <p className="text-sm text-stone-600 mt-1">Upload a revised version to see what changed</p>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)} 
                disabled={isComparing}
                className="hover:bg-stone-100 p-2 rounded disabled:opacity-50" 
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!comparisonResult ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Current Version
                    </h4>
                    <p className="text-blue-800 font-medium">{analysis.metadata.fileName}</p>
                    <p className="text-sm text-blue-600 mt-1">Risk Score: {analysis.riskScore}/100</p>
                  </div>

                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={(e) => setCompareFile(e.target.files?.[0] || null)}
                      className="hidden"
                      aria-label="Upload revised contract version"
                    />
                    {!compareFile ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isComparing}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Revised Version
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-300 rounded">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">{compareFile.name}</span>
                        </div>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={handleCompareVersions}
                            disabled={isComparing}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {isComparing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Compare Now
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setCompareFile(null)}
                            disabled={isComparing}
                            className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
                          >
                            Choose Different File
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Comparison Header */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-stone-600 uppercase tracking-wider mb-1">Risk Change</p>
                      <p className={`text-2xl font-bold ${
                        comparisonResult.riskScoreChange.direction === 'improved' ? 'text-green-600' : 
                        comparisonResult.riskScoreChange.direction === 'worsened' ? 'text-red-600' : 
                        'text-stone-600'
                      }`}>
                        {comparisonResult.riskScoreChange.direction === 'improved' && '↓ '}
                        {comparisonResult.riskScoreChange.direction === 'worsened' && '↑ '}
                        {Math.abs(comparisonResult.riskScoreChange.delta).toFixed(0)} pts
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        {comparisonResult.riskScoreChange.old} → {comparisonResult.riskScoreChange.new}
                      </p>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-green-800 uppercase tracking-wider mb-1">Added Clauses</p>
                      <p className="text-2xl font-bold text-green-700">
                        {comparisonResult.clauseChanges.filter((c: any) => c.type === 'added').length}
                      </p>
                    </div>

                    <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg text-center">
                      <p className="text-xs text-red-800 uppercase tracking-wider mb-1">Removed Clauses</p>
                      <p className="text-2xl font-bold text-red-700">
                        {comparisonResult.clauseChanges.filter((c: any) => c.type === 'removed').length}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Summary</h4>
                    <p className="text-blue-800">{comparisonResult.summary}</p>
                  </div>

                  {/* Recommendations */}
                  {comparisonResult.recommendations.length > 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                      <h4 className="font-bold text-amber-900 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {comparisonResult.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="text-amber-800">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Clause Changes */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-stone-900 text-lg">Detailed Changes</h4>
                    
                    {comparisonResult.clauseChanges
                      .filter((change: any) => change.type !== 'unchanged')
                      .sort((a: any, b: any) => {
                        const order = { critical: 0, high: 1, medium: 2, low: 3 };
                        return order[a.significance as keyof typeof order] - order[b.significance as keyof typeof order];
                      })
                      .map((change: any, idx: number) => (
                        <div key={idx} className={`border-2 rounded-lg p-4 ${
                          change.type === 'added' ? 'bg-green-50 border-green-300' :
                          change.type === 'removed' ? 'bg-red-50 border-red-300' :
                          'bg-blue-50 border-blue-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-stone-900">
                              {change.type === 'added' && '+ '}
                              {change.type === 'removed' && '- '}
                              {change.type === 'modified' && '~ '}
                              {change.newClause?.title || change.oldClause?.title}
                            </h5>
                            <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                              change.significance === 'critical' ? 'bg-red-600 text-white' :
                              change.significance === 'high' ? 'bg-orange-600 text-white' :
                              change.significance === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-stone-400 text-white'
                            }`}>
                              {change.significance}
                            </span>
                          </div>

                          {change.type === 'modified' && change.riskChange && (
                            <div className={`text-sm font-medium mb-2 ${
                              change.riskChange.direction === 'improved' ? 'text-green-700' :
                              change.riskChange.direction === 'worsened' ? 'text-red-700' :
                              'text-stone-700'
                            }`}>
                              Risk: {change.riskChange.old} → {change.riskChange.new} 
                              ({change.riskChange.direction})
                            </div>
                          )}

                          {change.type === 'modified' && change.textDiff && (
                            <div className="text-sm space-y-2 mt-2">
                              {change.textDiff.additions.length > 0 && (
                                <div>
                                  <p className="font-medium text-green-800">Added words:</p>
                                  <p className="text-green-700">{change.textDiff.additions.join(', ')}</p>
                                </div>
                              )}
                              {change.textDiff.deletions.length > 0 && (
                                <div>
                                  <p className="font-medium text-red-800">Removed words:</p>
                                  <p className="text-red-700">{change.textDiff.deletions.join(', ')}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {change.type !== 'modified' && (
                            <p className="text-sm text-stone-700 mt-2">
                              {(change.newClause || change.oldClause).plainLanguage}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Export Comparison Report */}
                  <div className="flex justify-center gap-3 pt-4 border-t-2 border-stone-200">
                    <button
                      onClick={async () => {
                        const { generateComparisonReport } = await import('@/lib/version-compare');
                        const report = generateComparisonReport(comparisonResult);
                        const blob = new Blob([report], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `comparison-report-${Date.now()}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Export Comparison Report
                    </button>
                    <button
                      onClick={() => {
                        setComparisonResult(null);
                        setCompareFile(null);
                      }}
                      className="px-6 py-3 border-2 border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors"
                    >
                      Compare Another Version
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[70] px-6 py-4 rounded-lg shadow-2xl border-2 animate-slide-up ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-900' 
            : 'bg-red-50 border-red-500 text-red-900'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
