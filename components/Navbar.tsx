'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  FileSearch, 
  BookTemplate, 
  ArrowLeftRight, 
  MessageSquare, 
  BookOpen, 
  FileText,
  Shield,
  User,
  LogIn,
  AlertTriangle,
  Target,
  Briefcase,
  Search,
  Clock,
  TrendingUp,
  X,
  Scale,
  FolderOpen,
  Calendar,
  BarChart3,
  Users,
  FileSignature,
  ChevronDown,
  Menu,
  Settings,
  LogOut,
  Bell,
  Zap,
  Lock,
  Brain
} from 'lucide-react';
import { useAuth, signOut as authSignOut, getUserInitials } from '@/lib/auth-utils';

// Primary navigation items (most important features)
const primaryServices = [
  { name: 'AI Draft', href: '/drafting', icon: FileSearch, badge: 'NEW' },
  { name: 'Analyze', href: '/analyze', icon: FileSearch },
  { name: 'Contracts', href: '/contracts', icon: FolderOpen },
  { name: 'Templates', href: '/templates-enhanced', icon: BookTemplate },
  { name: 'Builder', href: '/template-builder', icon: BookTemplate, badge: 'NEW' },
  { name: 'E-Signature', href: '/esignature', icon: FileSignature },
  { name: 'Library', href: '/library', icon: BookOpen, hasMegaMenu: true },
];

// Secondary navigation items
const secondaryServices = [
  { name: 'Intelligence', href: '/intelligence', icon: TrendingUp, badge: 'NEW' },
  { name: 'Negotiate', href: '/negotiate', icon: MessageSquare, badge: 'AI' },
  { name: 'Smart Search', href: '/search', icon: Search, badge: 'AI' },
  { name: 'Market Intel', href: '/market-intelligence', icon: BarChart3, badge: 'LIVE' },
  { name: 'Risk Predict', href: '/risk', icon: Shield, badge: 'ML' },
  { name: 'Benchmark', href: '/benchmark', icon: BarChart3, badge: 'LIVE' },
  { name: 'Voice Contract', href: '/voice', icon: MessageSquare, badge: 'AI' },
  { name: 'Blockchain', href: '/blockchain', icon: Shield, badge: 'NEW' },
  { name: 'Clause Library', href: '/clauses', icon: BookOpen, badge: 'LIVE' },
  { name: 'Obligations', href: '/obligations', icon: Clock, badge: 'AUTO' },
  { name: 'Multi-Language', href: '/multi-language', icon: TrendingUp, badge: '50+' },
  { name: 'Renewals', href: '/renewals', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Compare', href: '/compare', icon: ArrowLeftRight },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Playbooks', href: '/playbooks', icon: FileText },
];

const libraryMegaMenu = [
  {
    title: 'Contract Types',
    icon: FileText,
    items: [
      { name: 'Employment Contracts', href: '/library#contract-types' },
      { name: 'Service Agreements', href: '/library#contract-types' },
      { name: 'Lease Agreements', href: '/library#contract-types' },
      { name: 'SaaS Agreements', href: '/library#contract-types' },
      { name: 'NDA & Confidentiality', href: '/library#contract-types' }
    ]
  },
  {
    title: 'Legal Terms',
    icon: BookOpen,
    items: [
      { name: 'Indemnification', href: '/library#legal-terms' },
      { name: 'Liability Cap', href: '/library#legal-terms' },
      { name: 'Force Majeure', href: '/library#legal-terms' },
      { name: 'Intellectual Property', href: '/library#legal-terms' },
      { name: 'Arbitration', href: '/library#legal-terms' }
    ]
  },
  {
    title: 'Red Flags',
    icon: AlertTriangle,
    items: [
      { name: 'Unlimited Liability', href: '/library#red-flags' },
      { name: 'Auto-Renewal Clauses', href: '/library#red-flags' },
      { name: 'One-Sided Terms', href: '/library#red-flags' },
      { name: 'IP Transfer Issues', href: '/library#red-flags' },
      { name: 'Venue Requirements', href: '/library#red-flags' }
    ]
  },
  {
    title: 'Protections',
    icon: Shield,
    items: [
      { name: 'Capped Liability', href: '/library#protections' },
      { name: 'Right to Cure', href: '/library#protections' },
      { name: 'Mutual Confidentiality', href: '/library#protections' },
      { name: 'Clear Payment Terms', href: '/library#protections' },
      { name: 'Termination Rights', href: '/library#protections' }
    ]
  },
  {
    title: 'Negotiation',
    icon: Target,
    items: [
      { name: 'Negotiation Strategies', href: '/library#negotiation-tips' },
      { name: 'Red-Lining Tips', href: '/library#negotiation-tips' },
      { name: 'Deal Breakers', href: '/library#negotiation-tips' },
      { name: 'Mutual Terms', href: '/library#negotiation-tips' },
      { name: 'Documentation', href: '/library#negotiation-tips' }
    ]
  },
  {
    title: 'Industry Guides',
    icon: Briefcase,
    items: [
      { name: 'Tech & SaaS', href: '/library#industry-guidance' },
      { name: 'Creative Work', href: '/library#industry-guidance' },
      { name: 'Healthcare', href: '/library#industry-guidance' },
      { name: 'Real Estate', href: '/library#industry-guidance' },
      { name: 'Finance', href: '/library#industry-guidance' }
    ]
  }
];

const moreMegaMenu = [
  {
    title: 'AI-Powered Tools',
    icon: Zap,
    items: [
      { name: 'AI Negotiation Assistant', href: '/negotiate', icon: MessageSquare, description: 'Real-time counterproposals & tactics' },
      { name: 'Document Intelligence', href: '/intelligence', icon: Brain, description: 'OCR & entity extraction' },
      { name: 'Smart Search', href: '/search', icon: Search, description: 'Find anything with AI semantic search' },
      { name: 'Market Intelligence', href: '/market-intelligence', icon: TrendingUp, description: 'Live pricing & competitor analysis' },
      { name: 'Contract Automation', href: '/automation', icon: Zap, description: 'Automated workflows & smart triggers' },
      { name: 'Blockchain Verification', href: '/blockchain', icon: Lock, description: 'Immutable contract registry' },
      { name: 'AI Contract Chat', href: '/chat', icon: MessageSquare, description: 'Ask questions about your contracts' },
      { name: 'Risk Prediction', href: '/risk', icon: Shield, description: 'ML-powered risk scoring' }
    ]
  },
  {
    title: 'Management & Analytics',
    icon: BarChart3,
    items: [
      { name: 'My Contracts', href: '/contracts', icon: FolderOpen, description: 'Organize and manage all contracts' },
      { name: 'Analytics Dashboard', href: '/analytics', icon: BarChart3, description: 'Contract insights & metrics' },
      { name: 'Compliance Monitoring', href: '/compliance', icon: Shield, description: 'Real-time regulatory tracking' },
      { name: 'Benchmarking', href: '/benchmark', icon: Target, description: 'Compare vs market standards' },
      { name: 'Renewals Calendar', href: '/renewals', icon: Calendar, description: 'Track deadlines & auto-renewals' },
      { name: 'Compare Versions', href: '/compare', icon: ArrowLeftRight, description: 'Side-by-side comparison' }
    ]
  },
  {
    title: 'Collaboration & Support',
    icon: Users,
    items: [
      { name: 'Team Collaboration', href: '/team', icon: Users, description: 'Real-time co-editing & comments' },
      { name: 'Obligation Tracking', href: '/obligations', icon: Clock, description: 'Auto-extracted tasks & deadlines' },
      { name: 'Playbooks', href: '/playbooks', icon: FileText, description: 'Contract review guidelines' },
      { name: 'Find Lawyers', href: '/lawyers', icon: Scale, description: 'Connect with legal professionals' },
      { name: 'Help Center', href: '/help', icon: BookOpen, description: 'Guides and documentation' }
    ]
  }
];

const allSearchableContent = [
  { name: 'Employment Contracts', category: 'Contract Types', href: '/library#contract-types' },
  { name: 'Service Agreements', category: 'Contract Types', href: '/library#contract-types' },
  { name: 'Lease Agreements', category: 'Contract Types', href: '/library#contract-types' },
  { name: 'SaaS Agreements', category: 'Contract Types', href: '/library#contract-types' },
  { name: 'NDA & Confidentiality', category: 'Contract Types', href: '/library#contract-types' },
  { name: 'Indemnification', category: 'Legal Terms', href: '/library#legal-terms' },
  { name: 'Liability Cap', category: 'Legal Terms', href: '/library#legal-terms' },
  { name: 'Force Majeure', category: 'Legal Terms', href: '/library#legal-terms' },
  { name: 'Intellectual Property', category: 'Legal Terms', href: '/library#legal-terms' },
  { name: 'Arbitration', category: 'Legal Terms', href: '/library#legal-terms' },
  { name: 'Unlimited Liability', category: 'Red Flags', href: '/library#red-flags' },
  { name: 'Auto-Renewal Clauses', category: 'Red Flags', href: '/library#red-flags' },
  { name: 'One-Sided Terms', category: 'Red Flags', href: '/library#red-flags' },
  { name: 'IP Transfer Issues', category: 'Red Flags', href: '/library#red-flags' },
  { name: 'Venue Requirements', category: 'Red Flags', href: '/library#red-flags' },
  { name: 'Capped Liability', category: 'Protections', href: '/library#protections' },
  { name: 'Right to Cure', category: 'Protections', href: '/library#protections' },
  { name: 'Mutual Confidentiality', category: 'Protections', href: '/library#protections' },
  { name: 'Clear Payment Terms', category: 'Protections', href: '/library#protections' },
  { name: 'Termination Rights', category: 'Protections', href: '/library#protections' },
  { name: 'Negotiation Strategies', category: 'Negotiation', href: '/library#negotiation-tips' },
  { name: 'Red-Lining Tips', category: 'Negotiation', href: '/library#negotiation-tips' },
  { name: 'Deal Breakers', category: 'Negotiation', href: '/library#negotiation-tips' },
  { name: 'Mutual Terms', category: 'Negotiation', href: '/library#negotiation-tips' },
  { name: 'Documentation', category: 'Negotiation', href: '/library#negotiation-tips' },
  { name: 'Tech & SaaS', category: 'Industry Guides', href: '/library#industry-guidance' },
  { name: 'Creative Work', category: 'Industry Guides', href: '/library#industry-guidance' },
  { name: 'Healthcare', category: 'Industry Guides', href: '/library#industry-guidance' },
  { name: 'Real Estate', category: 'Industry Guides', href: '/library#industry-guidance' },
  { name: 'Finance', category: 'Industry Guides', href: '/library#industry-guidance' },
  { name: 'Analyze Contract', category: 'Tools', href: '/analyze' },
  { name: 'Templates', category: 'Tools', href: '/templates' },
  { name: 'Compare Versions', category: 'Tools', href: '/compare' },
  { name: 'Contract Chat', category: 'Tools', href: '/chat' },
  { name: 'Playbooks', category: 'Tools', href: '/playbooks' }
];

const trendingSearches = [
  'Employment contract red flags',
  'NDA negotiation tips',
  'SaaS agreement liability',
  'Indemnification clause',
  'Auto-renewal clauses'
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close menus on Escape
      if (e.key === 'Escape') {
        setShowMegaMenu(false);
        setShowMoreMenu(false);
        setShowSearchDropdown(false);
        setShowMobileMenu(false);
        setShowUserMenu(false);
      }
      
      // Focus search on "/" key
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredResults = searchQuery.trim() 
    ? allSearchableContent.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Brand Bar */}
      <div className="border-b-2 border-stone-900">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-stone-900" strokeWidth={2} />
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">BeforeYouSign</h1>
              </div>
            </Link>

            {/* Advanced Search Bar */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search contracts, legal terms, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-stone-300 rounded-full focus:outline-none focus:border-stone-900 text-sm bg-stone-50 focus:bg-white transition-all text-stone-900 font-medium placeholder:text-stone-400 placeholder:font-normal"
                  autoComplete="off"
                />
              </div>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-2xl z-[200] max-h-[500px] overflow-y-auto">
                  {/* Search Results */}
                  {searchQuery.trim() && filteredResults.length > 0 && (
                    <div className="p-4 border-b border-stone-200">
                      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        <Search className="w-3 h-3" />
                        <span>Search Results</span>
                      </div>
                      <div className="space-y-1">
                        {filteredResults.map((result, index) => (
                          <Link
                            key={index}
                            href={result.href}
                            onClick={() => {
                              handleSearch(searchQuery);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
                              <div>
                                <p className="text-sm font-medium text-stone-900">{result.name}</p>
                                <p className="text-xs text-stone-500">{result.category}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery.trim() && filteredResults.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm text-stone-500">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-stone-400 mt-1">Try searching for contracts, legal terms, or guides</p>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {!searchQuery.trim() && recentSearches.length > 0 && (
                    <div className="p-4 border-b border-stone-200">
                      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        <Clock className="w-3 h-3" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-lg transition-colors group"
                          >
                            <button
                              onClick={() => setSearchQuery(search)}
                              className="flex items-center gap-3 flex-1 text-left"
                            >
                              <Clock className="w-4 h-4 text-stone-400" />
                              <span className="text-sm text-stone-700">{search}</span>
                            </button>
                            <button
                              onClick={() => clearRecentSearch(search)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-200 rounded transition-all"
                              aria-label="Clear recent search"
                            >
                              <X className="w-3 h-3 text-stone-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  {!searchQuery.trim() && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending Searches</span>
                      </div>
                      <div className="space-y-1">
                        {trendingSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors w-full text-left group"
                          >
                            <TrendingUp className="w-4 h-4 text-stone-400 group-hover:text-stone-900" />
                            <span className="text-sm text-stone-700">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/lawyers"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all rounded-lg shadow-md"
              >
                <Scale className="w-4 h-4" strokeWidth={2.5} />
                <span>Find Lawyers</span>
                <div className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase">New</div>
              </Link>
              
              {isLoading ? (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-8 h-8 bg-stone-200 rounded-full animate-pulse"></div>
                </div>
              ) : isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="hidden lg:flex items-center justify-center w-10 h-10 hover:bg-stone-100 rounded-lg transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-stone-600" />
                    {/* Notification badge */}
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link>

                  {/* User Menu */}
                  <div ref={userMenuRef} className="hidden lg:block relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-lg transition-colors"
                      aria-label="User menu"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {getUserInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <ChevronDown className={`w-4 h-4 text-stone-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl z-50">
                        {/* User Info */}
                        <div className="p-4 border-b border-stone-200">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">
                                  {getUserInitials(user.name)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                              <p className="text-xs text-stone-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/contracts"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                          >
                            <FolderOpen className="w-4 h-4" />
                            <span>My Contracts</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                        </div>

                        {/* Sign Out */}
                        <div className="p-2 border-t border-stone-200">
                          <button
                            onClick={async () => {
                              setShowUserMenu(false);
                              await authSignOut();
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    <LogIn className="w-4 h-4" strokeWidth={2} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden sm:flex items-center gap-2 px-5 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors rounded-lg"
                  >
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Navigation - Desktop */}
      <div className="hidden md:block bg-white border-b border-stone-200 relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <nav className="flex items-center gap-1 overflow-x-auto py-1" role="navigation" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 transparent' }}>
            {primaryServices.map((service) => {
              const Icon = service.icon;
              const isActive = pathname === service.href;
              
              if (service.hasMegaMenu) {
                return (
                  <div 
                    key={service.href} 
                    className="relative"
                    onMouseEnter={() => {
                      if (megaMenuTimeoutRef.current) {
                        clearTimeout(megaMenuTimeoutRef.current);
                      }
                      setShowMegaMenu(true);
                    }}
                    onMouseLeave={() => {
                      megaMenuTimeoutRef.current = setTimeout(() => {
                        setShowMegaMenu(false);
                      }, 100);
                    }}
                  >
                    <Link
                      href={service.href}
                      className={`group relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all whitespace-nowrap rounded-lg ${
                        isActive ? 'text-stone-900 bg-stone-100' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Icon 
                        className={`w-4 h-4 transition-all ${
                          isActive ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'
                        }`}
                        strokeWidth={2.5}
                      />
                      <span className="tracking-wide">{service.name}</span>
                    </Link>

                    {/* Mega Menu Panel */}
                    {showMegaMenu && (
                      <>
                        {/* Invisible bridge to prevent gap issues */}
                        <div 
                          className="absolute left-0 right-0 h-4" 
                          style={{ top: '100%' }}
                          onMouseEnter={() => {
                            if (megaMenuTimeoutRef.current) {
                              clearTimeout(megaMenuTimeoutRef.current);
                            }
                          }}
                        />
                        <div
                          className="fixed left-1/2 -translate-x-1/2 bg-white border border-stone-200 rounded-xl shadow-2xl z-[9999]"
                          style={{ width: '1200px', maxWidth: '95vw', top: '128px' }}
                          onMouseEnter={() => {
                            if (megaMenuTimeoutRef.current) {
                              clearTimeout(megaMenuTimeoutRef.current);
                            }
                            setShowMegaMenu(true);
                          }}
                          onMouseLeave={() => {
                            megaMenuTimeoutRef.current = setTimeout(() => {
                              setShowMegaMenu(false);
                            }, 100);
                          }}
                        >
                        <div className="p-8">
                          <div className="grid grid-cols-3 gap-6">
                            {libraryMegaMenu.map((category) => {
                              const CategoryIcon = category.icon;
                              return (
                                <div key={category.title}>
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-200">
                                    <CategoryIcon className="w-5 h-5 text-stone-900" />
                                    <h3 className="font-bold text-stone-900 text-sm">{category.title}</h3>
                                  </div>
                                  <ul className="space-y-2">
                                    {category.items.map((item) => (
                                      <li key={item.name}>
                                        <Link
                                          href={item.href}
                                          className="text-xs text-stone-600 hover:text-stone-900 hover:translate-x-1 transition-all inline-block"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>

                          {/* CTA */}
                          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-stone-900 mb-1">Need help understanding your contract?</p>
                              <p className="text-xs text-stone-600">Get instant AI-powered analysis</p>
                            </div>
                            <Link
                              href="/analyze"
                              className="px-6 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
                            >
                              Analyze Now
                            </Link>
                          </div>
                        </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`group relative flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all whitespace-nowrap rounded-lg ${
                    isActive 
                      ? 'text-stone-900 bg-stone-100' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 transition-all ${
                      isActive ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'
                    }`}
                    strokeWidth={2.5}
                  />
                  <span className="tracking-wide">{service.name}</span>
                  {service.badge && (
                    <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded text-[10px] font-bold uppercase">
                      {service.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* More Menu for Secondary Services */}
            <div 
              ref={moreMenuRef} 
              className="relative ml-2"
              onMouseEnter={() => {
                if (moreMenuTimeoutRef.current) {
                  clearTimeout(moreMenuTimeoutRef.current);
                }
                setShowMoreMenu(true);
              }}
              onMouseLeave={() => {
                moreMenuTimeoutRef.current = setTimeout(() => {
                  setShowMoreMenu(false);
                }, 100);
              }}
            >
              <button
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-all whitespace-nowrap"
                aria-label="More navigation options"
                {...(showMoreMenu && { 'aria-expanded': true })}
              >
                <span>More</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                />
              </button>

              {/* More Mega Menu */}
              {showMoreMenu && (
                <>
                  {/* Invisible bridge to prevent gap issues */}
                  <div 
                    className="absolute left-0 right-0 h-4" 
                    style={{ top: '100%' }}
                    onMouseEnter={() => {
                      if (moreMenuTimeoutRef.current) {
                        clearTimeout(moreMenuTimeoutRef.current);
                      }
                    }}
                  />
                  <div
                    className="fixed right-6 bg-white border border-stone-200 rounded-xl shadow-2xl z-[9999]"
                    style={{ width: '900px', maxWidth: '95vw', top: '128px' }}
                    onMouseEnter={() => {
                      if (moreMenuTimeoutRef.current) {
                        clearTimeout(moreMenuTimeoutRef.current);
                      }
                      setShowMoreMenu(true);
                    }}
                    onMouseLeave={() => {
                      moreMenuTimeoutRef.current = setTimeout(() => {
                        setShowMoreMenu(false);
                      }, 100);
                    }}
                  >
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-6">
                      {moreMegaMenu.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                          <div key={category.title}>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-200">
                              <CategoryIcon className="w-5 h-5 text-stone-900" />
                              <h3 className="font-bold text-stone-900 text-sm">{category.title}</h3>
                            </div>
                            <div className="space-y-2">
                              {category.items.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group block p-2 hover:bg-stone-50 rounded-lg transition-colors"
                                  >
                                    <div className="flex items-start gap-2">
                                      <ItemIcon className="w-4 h-4 text-stone-500 group-hover:text-stone-900 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                      <div>
                                        <div className="text-sm font-medium text-stone-700 group-hover:text-stone-900">
                                          {item.name}
                                        </div>
                                        <div className="text-xs text-stone-500 mt-0.5">
                                          {item.description}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-6 pt-6 border-t border-stone-200">
                      <div className="flex items-center justify-between bg-gradient-to-r from-stone-50 to-stone-100 p-4 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-stone-900 text-sm">Need expert legal help?</h4>
                          <p className="text-xs text-stone-600 mt-1">Connect with verified lawyers for contract review</p>
                        </div>
                        <Link
                          href="/lawyers"
                          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all rounded-lg shadow-md whitespace-nowrap"
                        >
                          Find Lawyers
                        </Link>
                      </div>
                    </div>
                  </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-stone-200">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search contracts, legal terms..."
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-stone-300 rounded-full focus:outline-none focus:border-stone-900 text-sm bg-stone-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {primaryServices.map((service) => {
                const Icon = service.icon;
                const isActive = pathname === service.href;
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-stone-100 text-stone-900' 
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium">{service.name}</span>
                  </Link>
                );
              })}

              {/* Secondary Services in Mobile */}
              <div className="pt-2 mt-2 border-t border-stone-200">
                <div className="px-4 py-2 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  More Tools
                </div>
                {secondaryServices.map((service) => {
                  const Icon = service.icon;
                  const isActive = pathname === service.href;
                  return (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-stone-100 text-stone-900' 
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">{service.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth Links */}
              <div className="pt-2 mt-2 border-t border-stone-200 space-y-2">
                <Link
                  href="/lawyers"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md"
                >
                  <Scale className="w-5 h-5" />
                  <span>Find Lawyers</span>
                  <div className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase">New</div>
                </Link>
                
                {isAuthenticated && user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-stone-100 rounded-lg">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {getUserInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-900 truncate">{user.name}</p>
                        <p className="text-xs text-stone-600 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* User Menu Items */}
                    <Link
                      href="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                      <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={async () => {
                        setShowMobileMenu(false);
                        await authSignOut();
                      }}
                      className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 text-white font-medium rounded-lg"
                    >
                      <User className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
