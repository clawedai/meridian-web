"use client";

import { useEffect, useState } from "react";
import { Brain, TrendingUp, Sparkles, BarChart3, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPredictionStats, getPredictionInsights } from "@/lib/api";
import type { PredictionStats, Insight } from "@/lib/types";

export default function PredictionsPage() {
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [predictions, setPredictions] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, insightsData] = await Promise.all([
        getPredictionStats(),
        getPredictionInsights(20),
      ]);
      setStats(statsData);
      setPredictions(insightsData);
    } catch (err: any) {
      console.error("Failed to load predictions:", err);
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (insight: Insight) => {
    const importance = insight.importance?.toLowerCase() || "medium";
    if (importance === "high") return "text-success";
    if (importance === "medium") return "text-warning";
    return "text-foreground-muted";
  };

  const getConfidenceBg = (importance: string) => {
    if (importance === "high") return "bg-success/10 border-success/20";
    if (importance === "medium") return "bg-warning/10 border-warning/20";
    return "bg-foreground-muted/10 border-foreground-muted/20";
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Predictions" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-foreground-muted">Loading predictions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Predictions" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-error">{error}</div>
          <button onClick={loadData} className="text-accent-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const highConfidence = stats.high_confidence_predictions;
  const confidencePercent = stats.total_predictions > 0
    ? (highConfidence / stats.total_predictions * 100).toFixed(0)
    : "0";

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Predictions"
        description="AI-powered predictions based on historical patterns and competitive signals"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Total Predictions</div>
              <div className="text-2xl font-bold text-foreground">{stats.total_predictions}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">High Confidence</div>
              <div className="text-2xl font-bold text-success">{highConfidence}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Confidence Rate</div>
              <div className="text-2xl font-bold text-foreground">{confidencePercent}%</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Patterns Learned</div>
              <div className="text-2xl font-bold text-foreground">{stats.pattern_count}</div>
            </CardContent>
          </Card>
        </div>

        {/* Most Common Patterns */}
        {stats.most_common_patterns.length > 0 && (
          <Card className="bg-background-secondary border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent-secondary" />
                <CardTitle className="text-sm font-medium">Detected Patterns</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.most_common_patterns.map((pattern, i) => (
                  <Badge key={i} className="bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20 text-xs">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Predictions List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-primary" />
            Prediction Insights
          </h3>

          {predictions.length === 0 ? (
            <Card className="bg-background-secondary border-white/5">
              <CardContent className="p-8 text-center">
                <Brain className="h-10 w-10 text-foreground-muted mx-auto mb-3" />
                <div className="text-foreground font-medium mb-1">No predictions yet</div>
                <div className="text-foreground-muted text-sm">
                  Predictions are generated after the system learns patterns from your entity data.
                  <br />
                  This requires 4+ insights per entity over time.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {predictions.map((insight) => (
                <Card key={insight.id} className="bg-background-secondary border-white/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-accent-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">
                            {insight.title || "Prediction"}
                          </span>
                          {insight.entity_name && (
                            <Badge className="text-[10px] bg-info/10 text-info border-info/20">
                              {insight.entity_name}
                            </Badge>
                          )}
                        </div>
                        {insight.content && (
                          <p className="text-sm text-foreground-secondary leading-relaxed">
                            {insight.content}
                          </p>
                        )}
                        {insight.metadata && typeof insight.metadata === "object" && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(insight.metadata as Record<string, any>).map(([key, value]) => (
                              <span key={key} className="text-xs text-foreground-muted">
                                <span className="text-foreground-secondary">{key}:</span> {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-xs border ${getConfidenceBg(insight.importance || "medium")}`}>
                          {insight.importance || "medium"} confidence
                        </Badge>
                        {insight.created_at && (
                          <span className="text-xs text-foreground-muted">
                            {new Date(insight.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
