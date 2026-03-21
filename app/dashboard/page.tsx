"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Rss, Lightbulb, Bell, Plus, RefreshCw, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getInsightIcon, getPriorityClass } from "@/lib/utils";
import type { Insight, DashboardStats } from "@/lib/types";
import { getDashboardStats, getRecentInsights } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, insightsData] = await Promise.all([
        getDashboardStats(),
        getRecentInsights(5),
      ]);
      setStats(statsData);
      setInsights(insightsData);
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const triggerPipeline = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipeline/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Pipeline triggered! New insights will appear shortly.");
      }
    } catch (err) {
      console.error("Failed to trigger pipeline:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Dashboard" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <p className="text-error mb-4">{error}</p>
            <Button onClick={loadDashboard}>Try Again</Button>
          </Card>
        </div>
      </>
    );
  }

  const unreadCount = insights.filter((i) => !i.is_read).length;

  return (
    <>
      <Header title="Dashboard" subtitle={stats ? `${stats.unread_insight_count} unread insights` : "Dashboard"} />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary">Entities</p>
                  <p className="text-3xl font-bold text-foreground animate-number">
                    {stats?.entity_count || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-accent-primary/10">
                  <Building2 className="h-6 w-6 text-accent-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary">Data Sources</p>
                  <p className="text-3xl font-bold text-foreground animate-number">
                    {stats?.active_source_count || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-success/10">
                  <Rss className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary">This Week</p>
                  <p className="text-3xl font-bold text-foreground animate-number">
                    {stats?.insights_this_week || 0}
                  </p>
                  <p className="text-xs text-foreground-muted">insights</p>
                </div>
                <div className="p-3 rounded-full bg-warning/10">
                  <Lightbulb className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-secondary">Active Alerts</p>
                  <p className="text-3xl font-bold text-foreground animate-number">
                    {stats?.active_alert_count || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-info/10">
                  <Bell className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Link href="/dashboard/entities/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entity
            </Button>
          </Link>
          <Link href="/dashboard/sources/new">
            <Button variant="outline" className="gap-2">
              <Rss className="h-4 w-4" />
              Add Source
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 ml-auto"
            onClick={triggerPipeline}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Latest Insights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Latest Insights
            </h2>
            <Link
              href="/dashboard/insights"
              className="text-sm text-accent-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => (
                <Card
                  key={insight.id}
                  className={`card-hover ${getPriorityClass(insight.importance)} ${
                    !insight.is_read ? "bg-background-secondary" : "bg-background"
                  }`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">
                        {getInsightIcon(insight.insight_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium ${
                              insight.is_read
                                ? "text-foreground-secondary"
                                : "text-foreground"
                            }`}
                          >
                            {insight.title}
                          </h3>
                          {!insight.is_read && (
                            <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
                          )}
                        </div>
                        <p className="text-sm text-foreground-secondary line-clamp-2">
                          {insight.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge
                            variant={
                              insight.importance === "critical"
                                ? "critical"
                                : insight.importance === "high"
                                ? "high"
                                : insight.importance === "medium"
                                ? "medium"
                                : "low"
                            }
                          >
                            {insight.importance}
                          </Badge>
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
                <Lightbulb className="h-8 w-8 text-accent-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No insights yet
              </h3>
              <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
                Start by adding your first entity and data source. We'll monitor and analyze automatically.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/dashboard/entities/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Entity
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={triggerPipeline}
                >
                  <RefreshCw className="h-4 w-4" />
                  Trigger Analysis
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
