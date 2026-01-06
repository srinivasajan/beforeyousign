'use client';

import { useState, useEffect } from 'react';
import { BusinessIntelligenceEngine, ContractPortfolio, ExecutiveKPIs } from '@/lib/business-intelligence';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BusinessIntelligenceDashboard() {
  const [portfolio, setPortfolio] = useState<ContractPortfolio | null>(null);
  const [kpis, setKPIs] = useState<ExecutiveKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'savings' | 'vendors' | 'risks' | 'renewals'>('overview');

  const engine = new BusinessIntelligenceEngine();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // In production, fetch actual contract data
      const mockContracts = generateMockContracts();
      const portfolioData = await engine.analyzePortfolio(mockContracts);
      const kpisData = await engine.generateExecutiveKPIs(mockContracts);
      
      setPortfolio(portfolioData);
      setKPIs(kpisData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !portfolio || !kpis) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold mb-2">Business Intelligence Dashboard</h1>
        <p className="text-gray-600">Portfolio optimization and strategic insights</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex">
          {(['overview', 'savings', 'vendors', 'risks', 'renewals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Spend"
                value={`$${(kpis.totalSpend / 1000000).toFixed(1)}M`}
                change={kpis.spendGrowth}
                trend={kpis.spendGrowth < 0 ? 'down' : 'up'}
                icon="💰"
              />
              <KPICard
                title="Cost Savings"
                value={`$${(kpis.costSavingsRealized / 1000).toFixed(0)}k`}
                change={15}
                trend="up"
                icon="💎"
              />
              <KPICard
                title="Active Contracts"
                value={kpis.activeContracts}
                change={8}
                trend="up"
                icon="📄"
              />
              <KPICard
                title="Compliance Rate"
                value={`${kpis.complianceRate.toFixed(0)}%`}
                change={5}
                trend="up"
                icon="✅"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spend by Category */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Spend by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(portfolio.byCategory).map(([name, data]) => ({
                        name,
                        value: data.totalValue,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}k`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(portfolio.byCategory).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Vendors */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Top 5 Vendors</h3>
                <div className="space-y-3">
                  {portfolio.topVendors.slice(0, 5).map((vendor, idx) => (
                    <div key={vendor.vendorId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-300">{idx + 1}</span>
                        <div>
                          <p className="font-medium">{vendor.vendorName}</p>
                          <p className="text-sm text-gray-600">{vendor.percentOfTotal.toFixed(1)}% of total spend</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(vendor.totalSpend / 1000).toFixed(0)}k</p>
                        <span className={`text-xs ${
                          vendor.trend === 'increasing' ? 'text-red-600' :
                          vendor.trend === 'decreasing' ? 'text-green-600' :
                          'text-gray-600'
                        }`}>
                          {vendor.trend === 'increasing' ? '↑' : vendor.trend === 'decreasing' ? '↓' : '→'} {vendor.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Avg Cycle Time" value={`${kpis.avgCycleTime} days`} target="<15 days" />
              <MetricCard title="On-Time Execution" value={`${kpis.onTimeExecution}%`} target=">90%" />
              <MetricCard title="Vendor Performance" value={`${kpis.vendorPerformance}/100`} target=">80" />
            </div>
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                💰 ${(portfolio.costSavingsOpportunities.reduce((sum, opp) => sum + opp.estimatedSavings, 0) / 1000).toFixed(0)}k
                <span className="text-lg font-normal ml-2">in potential annual savings identified</span>
              </h2>
            </div>

            {portfolio.costSavingsOpportunities.map((opportunity, idx) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">
                        {opportunity.type === 'consolidation' ? '🔄' :
                         opportunity.type === 'volume-discount' ? '📊' :
                         opportunity.type === 'renegotiation' ? '💬' :
                         opportunity.type === 'elimination' ? '✂️' : '💡'}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      ${(opportunity.estimatedSavings / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-600">{opportunity.savingsPercentage}% savings</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Confidence</p>
                    <p className="font-semibold capitalize">{opportunity.confidence}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Effort</p>
                    <p className="font-semibold capitalize">{opportunity.effort}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Timeline</p>
                    <p className="font-semibold">{opportunity.timeline} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Priority</p>
                    <p className="font-semibold">{opportunity.priority}/10</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Action Items:</p>
                  <ul className="space-y-1">
                    {opportunity.actionItems.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-6">
            {Object.entries(portfolio.byVendor).map(([vendorId, vendor]) => (
              <div key={vendorId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{vendor.vendorName}</h3>
                    <p className="text-sm text-gray-600">{vendor.contractCount} contracts • {vendor.relationshipLength} months relationship</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${(vendor.totalSpend / 1000).toFixed(0)}k</div>
                    <div className="text-sm text-gray-600">{vendor.concentration.toFixed(1)}% of total</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-blue-600 mb-1">Performance</p>
                    <p className="text-lg font-bold text-blue-900">{vendor.performanceScore}/100</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-green-600 mb-1">SLA Compliance</p>
                    <p className="text-lg font-bold text-green-900">{vendor.slaCompliance.toFixed(1)}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-xs text-purple-600 mb-1">Quality</p>
                    <p className="text-lg font-bold text-purple-900">{vendor.qualityRating}/5 ⭐</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="text-xs text-yellow-600 mb-1">On-Time</p>
                    <p className="text-lg font-bold text-yellow-900">{vendor.deliveryOnTime}%</p>
                  </div>
                  <div className={`p-3 rounded ${
                    vendor.riskLevel === 'low' ? 'bg-green-50' :
                    vendor.riskLevel === 'medium' ? 'bg-yellow-50' :
                    'bg-red-50'
                  }`}>
                    <p className={`text-xs mb-1 ${
                      vendor.riskLevel === 'low' ? 'text-green-600' :
                      vendor.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>Risk Level</p>
                    <p className={`text-lg font-bold capitalize ${
                      vendor.riskLevel === 'low' ? 'text-green-900' :
                      vendor.riskLevel === 'medium' ? 'text-yellow-900' :
                      'text-red-900'
                    }`}>{vendor.riskLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            {portfolio.riskExposures.map(risk => (
              <div key={risk.id} className={`rounded-lg shadow p-6 ${
                risk.severity === 'critical' ? 'bg-red-50 border-2 border-red-200' :
                risk.severity === 'high' ? 'bg-orange-50 border-2 border-orange-200' :
                risk.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        risk.severity === 'critical' ? 'bg-red-600 text-white' :
                        risk.severity === 'high' ? 'bg-orange-600 text-white' :
                        risk.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {risk.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 capitalize">{risk.riskType}</span>
                    </div>
                    <h3 className="text-xl font-bold">{risk.title}</h3>
                    <p className="text-gray-700 mt-1">{risk.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">${(risk.potentialLoss / 1000).toFixed(0)}k</div>
                    <div className="text-sm text-gray-600">{risk.probability}% probability</div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                  <p className="font-semibold mb-2">Recommended Actions:</p>
                  <ul className="space-y-1">
                    {risk.recommendedActions.map((action, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'renewals' && (
          <div className="space-y-6">
            {portfolio.upcomingRenewals.map(renewal => (
              <div key={renewal.contractId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{renewal.contractName}</h3>
                    <p className="text-gray-600">{renewal.vendor}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Renews in {renewal.daysUntilRenewal} days ({renewal.renewalDate.toLocaleDateString()})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Current → Projected</div>
                    <div className="text-2xl font-bold">
                      ${(renewal.currentValue / 1000).toFixed(0)}k → ${(renewal.projectedValue / 1000).toFixed(0)}k
                    </div>
                    <div className={`text-sm ${renewal.projectedIncrease > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {renewal.projectedIncrease > 0 ? '+' : ''}{renewal.projectedIncrease}% change
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg mb-4 ${
                  renewal.recommendation === 'renew' ? 'bg-green-50 border border-green-200' :
                  renewal.recommendation === 'renegotiate' ? 'bg-yellow-50 border border-yellow-200' :
                  renewal.recommendation === 'alternative' ? 'bg-blue-50 border border-blue-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <p className="font-semibold mb-1">
                    Recommendation: <span className="capitalize">{renewal.recommendation}</span>
                  </p>
                  <p className="text-sm">{renewal.reasoning}</p>
                </div>

                {renewal.negotiationPoints.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Negotiation Points:</p>
                    <ul className="space-y-1">
                      {renewal.negotiationPoints.map((point, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">▸</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon }: {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className={`text-sm ${trend === 'up' && change > 0 ? 'text-green-600' : trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}% from last period
      </p>
    </div>
  );
}

function MetricCard({ title, value, target }: { title: string; value: string; target: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-500">Target: {target}</p>
    </div>
  );
}

function generateMockContracts() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `contract-${i}`,
    name: `Contract ${i + 1}`,
    vendorId: `vendor-${i % 10}`,
    vendorName: `Vendor ${i % 10 + 1}`,
    value: Math.random() * 100000 + 10000,
    category: ['SaaS', 'Consulting', 'Services', 'Hardware'][i % 4],
    status: 'active',
    riskScore: Math.random() * 100,
    complianceScore: 70 + Math.random() * 30,
    renewalDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
    autoRenew: Math.random() > 0.5,
    utilizationRate: Math.random() * 100,
    performanceScore: 70 + Math.random() * 30,
    createdDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000),
    executedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  }));
}
