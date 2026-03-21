"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Filter, Search, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatRelativeTime,
  getInsightIcon,
  getPriorityClass,
} from "@/lib/utils";
import { getInsights, markInsightRead, markAllInsightsRead } from "@/lib/api";
import type { Insight, InsightImportance, InsightType } from "@/lib/types";

const importanceOptions: InsightImportance[] = ["critical", "high", "medium", "low"];
const typeOptions: InsightType[] = ["funding", "product", "hiring", "pr", "anomaly", "leadership", "partnership"];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [importanceFilter, setImportanceFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    loadInsights();
  }, [importanceFilter, typeFilter, showRead]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (importanceFilter !== "all") params.importance = importanceFilter;
      if (showRead) params.is_read = false;

      const data = await getInsights(params);
      setInsights(data);
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(search.toLowerCase()) ||
      insight.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || insight.insight_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const unreadCount = insights.filter((i) => !i.is_read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markInsightRead(id);
      setInsights(insights.map((i) =>
        i.id === id ? { ...i, is_read: true } : i
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllInsightsRead();
      setInsights(insights.map((i) => ({ ...i, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Insights" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Insights"
        subtitle={`${unreadCount} unread of ${insights.length} total`}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={importanceFilter} onValueChange={setImportanceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {importanceOptions.map((imp) => (
                  <SelectItem key={imp} value={imp} className="capitalize">
                    {imp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showRead ? "secondary" : "outline"}
              size="icon"
              onClick={() => setShowRead(!showRead)}
              title={showRead ? "Hide read" : "Show read"}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* Insights List */}
        {filteredInsights.length > 0 ? (
          <div className="space-y-3">
            {filteredInsights.map((insight) => (
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
                      {insight.summary && (
                        <p className="text-xs text-foreground-muted mt-2 italic">
                          {insight.summary}
                        </p>
                      )}
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
                        <Badge variant="outline" className="capitalize text-xs">
                          {insight.insight_type}
                        </Badge>
                        <span className="text-xs text-foreground-muted">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {formatRelativeTime(insight.generated_at)}
                        </span>
                      </div>
                    </div>
                    {!insight.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkRead(insight.id)}
                      >
                        Mark read
                      </Button>
                    )}
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
              No insights found
            </h3>
            <p className="text-foreground-secondary max-w-sm mx-auto">
              {search || importanceFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters to see more insights."
                : "Start tracking entities to generate insights automatically."}
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
