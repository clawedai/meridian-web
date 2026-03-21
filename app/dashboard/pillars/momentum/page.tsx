"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Zap, BarChart3 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMomentumStats } from "@/lib/api";
import type { MomentumStats, MomentumEntity } from "@/lib/types";

export default function MomentumPage() {
  const [stats, setStats] = useState<MomentumStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMomentumStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load momentum stats:", err);
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === "accelerating") return <TrendingUp className="h-4 w-4 text-success" />;
    if (direction === "decelerating") return <TrendingDown className="h-4 w-4 text-error" />;
    return <Minus className="h-4 w-4 text-foreground-muted" />;
  };

  const getDirectionColor = (direction: string) => {
    if (direction === "accelerating") return "bg-success/10 text-success border-success/20";
    if (direction === "decelerating") return "bg-error/10 text-error border-error/20";
    return "bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20";
  };

  const formatScore = (score: number) => {
    const sign = score > 0 ? "+" : "";
    return `${sign}${score.toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Signal Velocity" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-foreground-muted">Loading signal velocity data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Signal Velocity" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-error">{error}</div>
          <button onClick={loadStats} className="text-accent-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const heatPercent = Math.min(Math.max(stats.industry_heat_index, 0), 100);

  return (
    <div className="flex h-full flex-col">
      <Header title="Signal Velocity" description="Track momentum changes across your competitive landscape" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Entities Tracked</div>
              <div className="text-2xl font-bold text-foreground">{stats.total_entities_tracked}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Accelerating</div>
              <div className="text-2xl font-bold text-success">{stats.top_movers.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Decelerating</div>
              <div className="text-2xl font-bold text-error">{stats.top_decelerators.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Industry Heat</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">{heatPercent.toFixed(0)}%</span>
                <span className={`text-xs ${stats.industry_heat_change >= 0 ? "text-success" : "text-error"}`}>
                  {stats.industry_heat_change >= 0 ? "+" : ""}{stats.industry_heat_change.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heat Bar */}
        <Card className="bg-background-secondary border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">Industry Attention Heat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                style={{ width: `${heatPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-foreground-muted">
              <span>Cold</span>
              <span>Hot</span>
            </div>
          </CardContent>
        </Card>

        {/* Entity Tables */}
        <div className="grid grid-cols-3 gap-4">
          {/* Accelerating */}
          <Card className="bg-background-secondary border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <CardTitle className="text-sm font-medium">Accelerating</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.top_movers.length === 0 ? (
                <div className="text-foreground-muted text-sm">No accelerating entities</div>
              ) : (
                stats.top_movers.map((entity) => (
                  <EntityRow key={entity.entity_id} entity={entity} formatScore={formatScore} getDirectionIcon={getDirectionIcon} getDirectionColor={getDirectionColor} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Decelerating */}
          <Card className="bg-background-secondary border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-error" />
                <CardTitle className="text-sm font-medium">Decelerating</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.top_decelerators.length === 0 ? (
                <div className="text-foreground-muted text-sm">No decelerating entities</div>
              ) : (
                stats.top_decelerators.map((entity) => (
                  <EntityRow key={entity.entity_id} entity={entity} formatScore={formatScore} getDirectionIcon={getDirectionIcon} getDirectionColor={getDirectionColor} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Most Active */}
          <Card className="bg-background-secondary border-white/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent-primary" />
                <CardTitle className="text-sm font-medium">Most Active</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.most_active.length === 0 ? (
                <div className="text-foreground-muted text-sm">No active entities</div>
              ) : (
                stats.most_active.map((entity) => (
                  <EntityRow key={entity.entity_id} entity={entity} formatScore={formatScore} getDirectionIcon={getDirectionIcon} getDirectionColor={getDirectionColor} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EntityRow({
  entity,
  formatScore,
  getDirectionIcon,
  getDirectionColor,
}: {
  entity: MomentumEntity;
  formatScore: (n: number) => string;
  getDirectionIcon: (d: string) => React.ReactNode;
  getDirectionColor: (d: string) => string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        {getDirectionIcon(entity.direction)}
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground truncate">{entity.entity_name}</div>
          <div className="text-xs text-foreground-muted">
            {entity.insights_this_week} this week / {entity.insights_last_week} last week
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 ml-2">
        <span className={`text-xs font-mono font-medium ${entity.momentum_score >= 0 ? "text-success" : "text-error"}`}>
          {formatScore(entity.momentum_score)}
        </span>
        <Badge className={`text-[10px] px-1.5 py-0 border ${getDirectionColor(entity.direction)}`}>
          {entity.direction}
        </Badge>
      </div>
    </div>
  );
}
