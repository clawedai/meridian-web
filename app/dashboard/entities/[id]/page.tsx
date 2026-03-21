"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { getEntity, getSources, getInsights } from "@/lib/api";
import type { Entity, Source, Insight } from "@/lib/types";

function SourceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error",
    inactive: "bg-foreground-muted/20 text-foreground-muted",
  };
  return (
    <Badge className={colors[status] || colors.inactive}>
      {status}
    </Badge>
  );
}

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id as string;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "sources" | "insights">("overview");

  useEffect(() => {
    if (entityId) {
      loadData();
    }
  }, [entityId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entityData, sourcesData, insightsData] = await Promise.all([
        getEntity(entityId),
        getSources({ entity_id: entityId }),
        getInsights({ entity_id: entityId }),
      ]);
      setEntity(entityData);
      setSources(sourcesData);
      setInsights(insightsData);
    } catch (err) {
      console.error("Failed to load entity:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <p className="text-foreground-secondary mb-4">Entity not found</p>
          <Button onClick={() => router.push("/dashboard/entities")}>
            Back to Entities
          </Button>
        </Card>
      </div>
    );
  }

  const activeSources = sources.filter((s) => s.is_active);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title={entity.name} />
      <div className="flex-1 overflow-auto p-6">
        <Link
          href="/dashboard/entities"
          className="mb-4 inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to entities
        </Link>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent-primary/10">
            <span className="text-2xl font-bold text-accent-primary">
              {entity.name[0]}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{entity.name}</h1>
            {entity.industry && (
              <p className="text-sm text-foreground-secondary">{entity.industry}</p>
            )}
          </div>
        </div>

        {entity.tags && entity.tags.length > 0 && (
          <div className="mb-6 flex gap-2">
            {entity.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mb-6 flex gap-3 border-b border-white/5">
          <button
            onClick={() => setTab("overview")}
            className={`pb-3 text-sm font-medium ${
              tab === "overview"
                ? "border-b-2 border-accent-primary text-accent-primary"
                : "text-foreground-secondary"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("sources")}
            className={`pb-3 text-sm font-medium ${
              tab === "sources"
                ? "border-b-2 border-accent-primary text-accent-primary"
                : "text-foreground-secondary"
            }`}
          >
            Sources ({sources.length})
          </button>
          <button
            onClick={() => setTab("insights")}
            className={`pb-3 text-sm font-medium ${
              tab === "insights"
                ? "border-b-2 border-accent-primary text-accent-primary"
                : "text-foreground-secondary"
            }`}
          >
            Insights ({insights.length})
          </button>
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <h3 className="mb-2 font-semibold text-foreground">About</h3>
                <p className="text-foreground-secondary">
                  {entity.description || "No description provided."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Active Sources</span>
                  <span className="text-sm font-medium text-foreground">{activeSources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Total Fetches</span>
                  <span className="text-sm font-medium text-foreground">
                    {sources.reduce((acc, s) => acc + (s.fetch_count || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Insights</span>
                  <span className="text-sm font-medium text-foreground">{insights.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "sources" && (
          <div className="space-y-3">
            {sources.length > 0 ? (
              sources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <SourceStatusBadge status={source.status || "inactive"} />
                      <div>
                        <p className="font-medium text-foreground">{source.name}</p>
                        {source.url && (
                          <p className="text-xs text-foreground-muted">{source.url}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                      <span>
                        {source.last_fetched_at
                          ? formatRelativeTime(source.last_fetched_at)
                          : "Never"}
                      </span>
                      <span>{source.fetch_count} fetches</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-foreground-secondary mb-4">No sources added yet</p>
                <Link href={`/dashboard/sources/new?entity_id=${entity.id}`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Source
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}

        {tab === "insights" && (
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{insight.title}</h3>
                          {!insight.is_read && (
                            <span className="h-2 w-2 rounded-full bg-accent-primary" />
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-foreground-secondary">
                          {insight.content}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <Badge variant={insight.importance === "critical" ? "critical" : insight.importance === "high" ? "high" : insight.importance === "medium" ? "medium" : "low"}>
                            {insight.importance}
                          </Badge>
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
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-foreground-secondary mb-4">No insights generated yet</p>
                <p className="text-sm text-foreground-muted">Add sources to start generating insights</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
