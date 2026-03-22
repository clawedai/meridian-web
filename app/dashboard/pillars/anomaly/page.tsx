"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInsights } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import type { Insight } from "@/lib/types";

export default function AnomalyPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInsights({ importance: "critical" });
      // Filter to show anomaly-type insights + critical insights as anomalies
      const anomalies = data.filter(
        (i) => i.insight_type === "anomaly" || i.importance === "critical" || i.importance === "high"
      );
      setInsights(anomalies);
    } catch (err: any) {
      setError(err.message || "Failed to load anomalies");
    } finally {
      setLoading(false);
    }
  };

  const criticalCount = insights.filter((i) => i.importance === "critical").length;
  const highCount = insights.filter((i) => i.importance === "high").length;

  if (loading) {
    return (
      <>
        <Header title="Anomaly Detection" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Anomaly Detection" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <p className="text-error mb-4">{error}</p>
            <button onClick={loadAnomalies} className="text-accent-primary underline">Retry</button>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Anomaly Detection"
        description="Statistical anomalies and significant deviations from normal competitor behavior"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Total Anomalies</div>
              <div className="text-2xl font-bold text-foreground">{insights.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Critical</div>
              <div className="text-2xl font-bold text-error">{criticalCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">High Priority</div>
              <div className="text-2xl font-bold text-warning">{highCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="bg-accent-primary/5 border-accent-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">How Anomaly Detection Works</p>
                <p className="text-xs text-foreground-secondary mt-1">
                  Almanac monitors every competitor&apos;s normal behavior patterns over 12 weeks of history.
                  When activity deviates significantly (&gt;2σ) from the baseline — either a surge or a sudden drop —
                  it&apos;s flagged as an anomaly. Critical and high-priority anomalies appear here automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anomalies List */}
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card key={insight.id} className="bg-background-secondary border-white/5">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🚨</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{insight.title}</h3>
                        <Badge
                          variant={
                            insight.importance === "critical"
                              ? "critical"
                              : insight.importance === "high"
                              ? "high"
                              : "medium"
                          }
                        >
                          {insight.importance}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground-secondary">{insight.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-foreground-muted">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {formatRelativeTime(insight.generated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No anomalies detected
            </h3>
            <p className="text-foreground-secondary max-w-sm mx-auto">
              Anomalies are automatically detected when competitors show unusual activity patterns.
              Add more entities and sources to improve detection coverage.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
