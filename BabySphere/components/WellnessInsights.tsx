import React from 'react';
import { Sparkles, Heart, Brain, Moon, TrendingUp } from 'lucide-react';
import type { WellnessLog } from '../types/wellness';
import { generateInsights } from '../utils/insights';

interface WellnessInsightsProps {
  logs: WellnessLog[];
}

const ICONS = {
  energy: Brain,
  stress: Heart,
  sleep: Moon,
  pattern: TrendingUp
};

export function WellnessInsights({ logs }: WellnessInsightsProps) {
  const insights = generateInsights(logs);

  if (insights.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Sparkles className="w-8 h-8 mx-auto mb-3" />
        <p>Start tracking your wellness to receive personalized insights!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Personalized Insights
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = ICONS[insight.type as keyof typeof ICONS] || Sparkles;
          
          return (
            <div key={index} className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-blue-600">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{insight.title}</h4>
                  <p className="text-blue-700 text-sm mt-1">{insight.description}</p>
                  <ul className="mt-2 space-y-1">
                    {insight.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-blue-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}