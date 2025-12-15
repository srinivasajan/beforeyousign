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
  Scale
} from 'lucide-react';

const services = [
  { name: 'Analyze Contract', href: '/analyze', icon: FileSearch },
  { name: 'Templates', href: '/templates', icon: BookTemplate },
  { name: 'Compare Versions', href: '/compare', icon: ArrowLeftRight },
  { name: 'Contract Chat', href: '/chat', icon: MessageSquare },
  { name: 'Legal Library', href: '/library', icon: BookOpen, hasMegaMenu: true },
  { name: 'Playbooks', href: '/playbooks', icon: FileText },
  { name: 'Find Lawyers', href: '/lawyers', icon: Scale }
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
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        <div className="">
          <div className="flex items-center justify-between h-16 px-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-stone-900" strokeWidth={2} />
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">BeforeYouSign</h1>
              </div>
            </Link>

            {/* Advanced Search Bar */}
            <div ref={searchRef} className="flex-1 max-w-2xl mx-8 relative">
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
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
              >
                <LogIn className="w-4 h-4" strokeWidth={2} />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <User className="w-4 h-4" strokeWidth={2} />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Navigation */}
      <div className="bg-white shadow-md relative">
        <div className="">
          <nav className="flex items-center overflow-x-auto scrollbar-hide px-12" role="navigation">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = pathname === service.href;
              
              if (service.hasMegaMenu) {
                return (
                  <div 
                    key={service.href} 
                    className="relative"
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onMouseLeave={() => setShowMegaMenu(false)}
                  >
                    <Link
                      href={service.href}
                      className={`group relative flex items-center gap-2 py-4 pr-4 text-sm font-medium transition-all whitespace-nowrap first:pl-0 ${
                        isActive ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Icon 
                        className={`w-4 h-4 transition-all ${
                          isActive ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'
                        }`}
                        strokeWidth={2}
                      />
                      <span className="tracking-wide">{service.name}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                      )}
                    </Link>

                    {/* Mega Menu Panel */}
                    {showMegaMenu && (
                      <div
                        className="absolute left-0 top-full bg-white border border-stone-200 shadow-2xl z-[100] mt-0"
                        style={{ width: '900px', marginLeft: '-200px' }}
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
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`group relative flex items-center gap-2 py-4 pr-4 text-sm font-medium transition-all whitespace-nowrap first:pl-0 ${
                    isActive ? 'text-stone-900' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 transition-all ${
                      isActive ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-700'
                    }`}
                    strokeWidth={2}
                  />
                  <span className="tracking-wide">{service.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
