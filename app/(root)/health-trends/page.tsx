/* eslint-disable @typescript-eslint/no-explicit-any */
// app/health-trends/page.tsx
'use client';

import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Droplets,
  Thermometer,
  Activity,
  Brain,
  Clock,
  BarChart3,
  Download,
  Share2
} from 'lucide-react';
import { useState } from 'react';

export default function HealthTrendsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const trends = [
    {
      metric: "Pain Levels",
      current: 3,
      previous: 5,
      trend: "improving",
      icon: Activity,
      color: "text-green-600",
      data: [5, 4, 6, 3, 2, 4, 3]
    },
    {
      metric: "Hydration",
      current: 85,
      previous: 70,
      trend: "improving",
      icon: Droplets,
      color: "text-blue-600",
      data: [70, 75, 80, 65, 85, 90, 85]
    },
    {
      metric: "Crisis Risk",
      current: 15,
      previous: 25,
      trend: "improving",
      icon: AlertTriangle,
      color: "text-yellow-600",
      data: [25, 20, 30, 15, 10, 15, 15]
    },
    {
      metric: "Stress Levels",
      current: 4,
      previous: 6,
      trend: "improving",
      icon: Brain,
      color: "text-purple-600",
      data: [6, 5, 7, 4, 3, 5, 4]
    }
  ];

  const patterns = [
    {
      title: "Cold Weather Impact",
      description: "Crisis risk increases by 40% when temperatures drop below 15°C",
      confidence: "High",
      occurrences: "12 times in last 3 months"
    },
    {
      title: "Hydration Benefits",
      description: "Maintaining 80%+ hydration reduces pain levels by 35% on average",
      confidence: "High",
      occurrences: "Consistent pattern"
    },
    {
      title: "Sleep Quality",
      description: "7+ hours of sleep decreases next-day crisis risk by 25%",
      confidence: "Medium",
      occurrences: "8 times in last month"
    },
    {
      title: "Stress Triggers",
      description: "High stress days are followed by increased pain 60% of the time",
      confidence: "Medium",
      occurrences: "6 times in last 2 months"
    }
  ];

  const recommendations = [
    {
      icon: Droplets,
      title: "Increase Water Intake",
      description: "Your hydration has improved, but maintaining 90%+ could reduce crisis frequency",
      priority: "high"
    },
    {
      icon: Thermometer,
      title: "Monitor Temperature",
      description: "Consider wearing warmer clothing as colder days approach",
      priority: "medium"
    },
    {
      icon: Clock,
      title: "Consistent Sleep",
      description: "Aim for 7-8 hours of sleep daily to maintain current improvement",
      priority: "medium"
    },
    {
      icon: Brain,
      title: "Stress Management",
      description: "Continue your meditation practice - it's showing positive results",
      priority: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-linear-to-br from-background to-muted border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Health Trends & Insights</h1>
              <p className="text-muted-foreground">
                Track your progress and discover patterns in your health journey
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                <Share2 className="w-4 h-4" />
                Share Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Time Range Selector */}
      <section className="py-6 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {[
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
              { value: 'year', label: 'Last Year' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === range.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Key Health Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trends.map((trend, index) => {
              const IconComponent = trend.icon;
              const isImproving = trend.trend === 'improving';
              
              return (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${trend.color} bg-opacity-10`}>
                        <IconComponent className={`w-5 h-5 ${trend.color}`} />
                      </div>
                      <span className="font-semibold">{trend.metric}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      isImproving ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${isImproving ? '' : 'rotate-180'}`} />
                      {isImproving ? 'Improving' : 'Declining'}
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{trend.current}{trend.metric === 'Hydration' ? '%' : ''}</div>
                      <div className="text-sm text-muted-foreground">
                        from {trend.previous}{trend.metric === 'Hydration' ? '%' : ''}
                      </div>
                    </div>
                    
                    {/* Simple sparkline chart */}
                    <div className="flex items-end gap-px h-8">
                      {trend.data.map((value, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-t"
                          style={{ height: `${(value / Math.max(...trend.data)) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Patterns & Insights */}
      <section className="py-8 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Discovered Patterns</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {patterns.map((pattern, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{pattern.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    pattern.confidence === 'High' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {pattern.confidence} confidence
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{pattern.description}</p>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {pattern.occurrences}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Personalized Recommendations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              const priorityColor = {
                high: 'text-red-600',
                medium: 'text-yellow-600',
                low: 'text-green-600'
              }[rec.priority];
              
              return (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-opacity-10 ${priorityColor} bg-current`}>
                      <IconComponent className={`w-6 h-6 ${priorityColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                      <p className="text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-8 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background rounded-2xl p-6 border border-border text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Overall Health Summary</h3>
            <p className="text-muted-foreground mb-4">
              Your health trends show significant improvement over the past month. 
              Continue following your current routine and focus on hydration for even better results.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="text-green-600">↑ 25% Improvement in pain management</div>
              <div className="text-blue-600">↑ 15% Better hydration consistency</div>
              <div className="text-yellow-600">↓ 30% Reduced crisis risk</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}