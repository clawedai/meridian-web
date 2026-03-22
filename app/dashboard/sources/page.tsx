"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rss,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  Link as LinkIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/utils";
import {
  getSources,
  refreshSource,
  deleteSource,
  updateSource,
  getEntities,
} from "@/lib/api";
import type { Source, Entity } from "@/lib/types";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case "error":
      return <XCircle className="h-4 w-4 text-error" />;
    default:
      return <span className="w-2 h-2 rounded-full bg-foreground-muted"></span>;
  }
};

const getSourceTypeIcon = (type: string) => {
  switch (type) {
    case "scrape":
      return <Globe className="h-4 w-4" />;
    case "rss":
      return <Rss className="h-4 w-4" />;
    case "api":
      return <LinkIcon className="h-4 w-4" />;
    case "manual":
      return <FileText className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

const getSourceTypeBadge = (type: string): "default" | "secondary" | "outline" => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    scrape: "default",
    rss: "secondary",
    api: "outline",
    manual: "outline",
  };
  return variants[type] || "outline";
};

const formatInterval = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sourcesData, entitiesData] = await Promise.all([
        getSources(),
        getEntities(false),
      ]);
      setSources(sourcesData);
      setEntities(entitiesData);
    } catch (err: any) {
      setError(err.message || "Failed to load sources");
    } finally {
      setLoading(false);
    }
  };

  const getEntityName = (entityId: string) => {
    const entity = entities.find((e) => e.id === entityId);
    return entity?.name || "Unknown";
  };

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    try {
      await refreshSource(id);
      await loadData();
    } catch (err) {
      console.error("Failed to refresh source:", err);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleToggleActive = async (source: Source) => {
    try {
      await updateSource(source.id, { is_active: !source.is_active });
      await loadData();
    } catch (err) {
      console.error("Failed to toggle source:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this source?")) return;
    try {
      await deleteSource(id);
      await loadData();
    } catch (err) {
      console.error("Failed to delete source:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Data Sources" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Data Sources" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <p className="text-error mb-4">{error}</p>
            <Button onClick={loadData}>Try Again</Button>
          </Card>
        </div>
      </>
    );
  }

  const filteredSources = sources.filter((source) =>
    statusFilter === "all" ? true : source.status === statusFilter
  );

  const statusCounts = {
    all: sources.length,
    active: sources.filter((s) => s.status === "active").length,
    warning: sources.filter((s) => s.status === "warning").length,
    error: sources.filter((s) => s.status === "error").length,
    inactive: sources.filter((s) => s.status === "inactive").length,
  };

  return (
    <>
      <Header
        title="Data Sources"
        subtitle={`${statusCounts.active} active of ${sources.length} total`}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "warning", label: "Warning" },
              { key: "error", label: "Error" },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={statusFilter === filter.key ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.key)}
                className="gap-2"
              >
                {filter.key !== "all" && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      filter.key === "active"
                        ? "bg-success"
                        : filter.key === "warning"
                        ? "bg-warning"
                        : "bg-error"
                    }`}
                  />
                )}
                {filter.label} ({statusCounts[filter.key as keyof typeof statusCounts]})
              </Button>
            ))}
          </div>
          <Link href="/dashboard/sources/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Source
            </Button>
          </Link>
        </div>

        {/* Sources List */}
        {filteredSources.length > 0 ? (
          <div className="space-y-3">
            {filteredSources.map((source) => (
              <Card
                key={source.id}
                className={`${source.status === "inactive" ? "opacity-60" : ""} ${
                  source.status === "error" ? "border-error/30" : ""
                }`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(source.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{source.name}</h3>
                          <Badge variant={getSourceTypeBadge(source.source_type)} className="text-xs gap-1">
                            {getSourceTypeIcon(source.source_type)}
                            {source.source_type}
                          </Badge>
                        </div>
                        <Link
                          href={`/dashboard/entities/${source.entity_id}`}
                          className="text-sm text-accent-primary hover:underline"
                        >
                          {getEntityName(source.entity_id)}
                        </Link>
                        {source.url && (
                          <p className="text-xs text-foreground-muted truncate max-w-md mt-1">
                            {source.url}
                          </p>
                        )}
                        {source.last_error && (
                          <p className="text-xs text-warning mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {source.last_error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-foreground">
                          {source.last_fetched_at
                            ? formatRelativeTime(source.last_fetched_at)
                            : "Never"}
                        </p>
                        <p className="text-xs text-foreground-muted">Last fetched</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground">{source.fetch_count}</p>
                        <p className="text-xs text-foreground-muted">Fetches</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground">{formatInterval(source.refresh_interval_minutes)}</p>
                        <p className="text-xs text-foreground-muted">Interval</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        disabled={refreshingId === source.id}
                        onClick={() => handleRefresh(source.id)}
                        title="Refresh source"
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshingId === source.id ? "animate-spin" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRefresh(source.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Fetch Now
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/sources/${source.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleActive(source)}>
                            {source.is_active ? "Pause Source" : "Resume Source"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-error" onClick={() => handleDelete(source.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
              <Rss className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No sources found
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
              {statusFilter !== "all"
                ? `No sources with status "${statusFilter}". Try a different filter.`
                : "Add your first data source to start tracking entities."}
            </p>
            <Link href="/dashboard/sources/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Source
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </>
  );
}
