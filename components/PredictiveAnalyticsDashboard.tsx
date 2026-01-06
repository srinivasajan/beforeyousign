'use client';

import { useState, useEffect } from 'react';
import { AdvancedAnalytics, ContractHealthScore, PredictiveInsight, PortfolioMetrics, RiskTrend } from '@/lib/predictive-analytics';
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, 
  PieChart, BarChart3, LineChart, Calendar, DollarSign, Shield,
  Users, FileText, Clock, Target, Zap, Brain, Bell
} from 'lucide-react';

export default function PredictiveAnalyticsDashboard() {
  const [analytics] = useState(new AdvancedAnalytics());
  const [healthScore, setHealthScore] = useState<ContractHealthScore | null>(null);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioMetrics | null>(null);
  const [riskTrend, setRiskTrend] = useState<RiskTrend | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock data - in production, fetch from API
    const mockHealthScore = analytics.calculateHealthScore({
      riskScore: 45,
      complianceIssues: 2,
      daysUntilRenewal: 90,
      amendmentCount: 3,
      disputeCount: 0,
      performanceMetrics: {
        costVariance: 5,
        paymentOnTime: 95,
        budgetAdherence: 90,
      },
    });
    setHealthScore(mockHealthScore);

    const mockInsights = analytics.generatePredictiveInsights([
      { date: new Date(), riskScore: 40, complianceIssues: 1, costVariance: 3, performanceScore: 85 },
      { date: new Date(), riskScore: 42, complianceIssues: 2, costVariance: 4, performanceScore: 83 },
      { date: new Date(), riskScore: 45, complianceIssues: 2, costVariance: 5, performanceScore: 80 },
    ]);
    setInsights(mockInsights);

    const mockPortfolio = analytics.analyzePortfolio([
      { id: '1', type: 'SaaS', industry: 'Technology', value: 100000, riskScore: 35, status: 'active', renewalDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), complianceRate: 95 },
      { id: '2', type: 'Employment', industry: 'Technology', value: 80000, riskScore: 25, status: 'active', complianceRate: 98 },
      { id: '3', type: 'Vendor', industry: 'Finance', value: 150000, riskScore: 55, status: 'active', renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), complianceRate: 90 },
      { id: '4', type: 'SaaS', industry: 'Healthcare', value: 200000, riskScore: 70, status: 'active', complianceRate: 85 },
    ]);
    setPortfolio(mockPortfolio);

    const mockRiskTrend = analytics.forecastRisk([
      { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), riskScore: 30 },
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), riskScore: 35 },
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), riskScore: 40 },
      { date: new Date(), riskScore: 45 },
    ], 90);
    setRiskTrend(mockRiskTrend);

    setLoading(false);
  };

  const getHealthGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string): string => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    return colors[impact] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Predictive Analytics
          </h1>
          <p className="text-gray-600 mt-1">AI-powered insights and forecasting</p>
        </div>

        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Health Score */}
      {healthScore && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Contract Health Score
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Overall Health</span>
                <span className={`text-6xl font-bold ${getHealthColor(healthScore.overall)}`}>
                  {getHealthGrade(healthScore.overall)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      healthScore.overall >= 80 ? 'bg-green-500' :
                      healthScore.overall >= 60 ? 'bg-yellow-500' :
                      healthScore.overall >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${healthScore.overall}%` }}
                  />
                </div>
                <span className="font-bold">{healthScore.overall}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Trend: {healthScore.trend === 'improving' ? '📈 Improving' : 
                       healthScore.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
              </p>
            </div>

            {/* Component Breakdown */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-3">Health Components</h3>
              <div className="space-y-3">
                {Object.entries(healthScore.components).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize">{key}</span>
                      <span className={getHealthColor(value)}>{value}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          value >= 80 ? 'bg-green-500' :
                          value >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {healthScore.alerts.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Active Alerts
              </h3>
              {healthScore.alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                  alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.message}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.impact}</p>
                      <p className="text-sm font-medium mt-2">Action: {alert.action}</p>
                      {alert.deadline && (
                        <p className="text-xs text-gray-500 mt-1">
                          Deadline: {new Date(alert.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {healthScore.recommendations.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="space-y-2">
                {healthScore.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Predictive Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-600" />
          Predictive Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${getImpactColor(insight.impact)}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold capitalize">{insight.type.replace(/_/g, ' ')}</h3>
                <span className="px-2 py-1 text-xs rounded bg-white">
                  {insight.probability}% likely
                </span>
              </div>

              <p className="text-sm mb-3">{insight.description}</p>

              <div className="text-sm space-y-1 mb-3">
                <p><strong>Timeframe:</strong> {insight.timeframe}</p>
                <p><strong>Confidence:</strong> {insight.confidence}%</p>
                {insight.estimatedCost && (
                  <p><strong>Estimated Cost:</strong> ${insight.estimatedCost.toLocaleString()}</p>
                )}
              </div>

              {insight.indicators.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-1">Indicators:</p>
                  <ul className="text-xs space-y-0.5">
                    {insight.indicators.slice(0, 3).map((ind, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span>•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.preventiveActions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-1">Preventive Actions:</p>
                  <ul className="text-xs space-y-0.5">
                    {insight.preventiveActions.slice(0, 2).map((action, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle className="h-3 w-3 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Metrics */}
      {portfolio && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart className="h-6 w-6 text-purple-600" />
            Portfolio Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{portfolio.totalContracts}</p>
              <p className="text-sm text-gray-600">Total Contracts</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-2xl font-bold">${(portfolio.totalValue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-2xl font-bold">{portfolio.averageHealth}%</p>
              <p className="text-sm text-gray-600">Avg Health</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <Calendar className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{portfolio.upcomingRenewals}</p>
              <p className="text-sm text-gray-600">Renewals (90d)</p>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Risk Distribution</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded">
                  <p className="text-2xl font-bold text-green-700">{portfolio.riskDistribution.low}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">Low Risk</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 p-3 rounded">
                  <p className="text-2xl font-bold text-yellow-700">{portfolio.riskDistribution.medium}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">Medium Risk</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded">
                  <p className="text-2xl font-bold text-orange-700">{portfolio.riskDistribution.high}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">High Risk</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 p-3 rounded">
                  <p className="text-2xl font-bold text-red-700">{portfolio.riskDistribution.critical}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">Critical</p>
              </div>
            </div>
          </div>

          {/* Top Risks */}
          {portfolio.topRisks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Top Risk Areas</h3>
              <ul className="space-y-1">
                {portfolio.topRisks.map((risk, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Risk Forecast */}
      {riskTrend && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LineChart className="h-6 w-6 text-indigo-600" />
            Risk Forecast
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-2xl font-bold">{riskTrend.current}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Change</p>
              <p className={`text-2xl font-bold flex items-center gap-1 ${
                riskTrend.trend === 'up' ? 'text-red-600' : 'text-green-600'
              }`}>
                {riskTrend.trend === 'up' ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {Math.abs(riskTrend.percentChange).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trend</p>
              <p className="text-2xl font-bold capitalize">{riskTrend.trend}</p>
            </div>
          </div>

          {/* Forecast visualization would go here */}
          <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
            <p>📊 Forecast chart visualization (next 90 days)</p>
            <div className="mt-2 space-y-1">
              {riskTrend.forecast.slice(0, 3).map((f, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{f.date}</span>
                  <span>Predicted: {f.predicted.toFixed(1)} ({f.confidence}% confidence)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
