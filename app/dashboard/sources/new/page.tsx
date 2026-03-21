"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Rss,
  Link as LinkIcon,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEntities, createSource, testSource } from "@/lib/api";
import type { Entity } from "@/lib/types";

const sourceTypes = [
  {
    id: "scrape",
    label: "Website Scrape",
    description: "Monitor any public webpage for changes",
    icon: Globe,
  },
  {
    id: "rss",
    label: "RSS Feed",
    description: "Aggregate content from RSS/Atom feeds",
    icon: Rss,
  },
  {
    id: "api",
    label: "API Endpoint",
    description: "Pull data from REST APIs",
    icon: LinkIcon,
  },
  {
    id: "manual",
    label: "Manual Upload",
    description: "Upload documents, PDFs, or data files",
    icon: FileText,
  },
];

const refreshIntervals = [
  { value: "60", label: "Every hour" },
  { value: "360", label: "Every 6 hours" },
  { value: "720", label: "Every 12 hours" },
  { value: "1440", label: "Once daily" },
  { value: "10080", label: "Once weekly" },
];

export default function NewSourcePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityIdFromUrl = searchParams.get("entity_id");

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    sourceType: "",
    entityId: entityIdFromUrl || "",
    name: "",
    url: "",
    refreshInterval: "360",
  });

  // Load entities on mount
  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      const data = await getEntities();
      setEntities(data);
    } catch (err) {
      console.error("Failed to load entities:", err);
    }
  };

  const handleTest = async () => {
    if (!formData.url) {
      setError("Please enter a URL first");
      return;
    }

    setTesting(true);
    setTestResult(null);
    setError("");

    try {
      // For now, just test if URL is accessible
      const response = await fetch(formData.url, { method: "HEAD" });
      if (response.ok || response.status === 405) {
        // 405 is okay for HEAD request
        setTestResult("success");
      } else {
        setTestResult("error");
      }
    } catch (err) {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSource({
        entity_id: formData.entityId,
        name: formData.name,
        source_type: formData.sourceType as any,
        url: formData.url || undefined,
        refresh_interval_minutes: parseInt(formData.refreshInterval),
      });

      router.push("/dashboard/sources");
    } catch (err: any) {
      setError(err.message || "Failed to create source");
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Add Data Source" subtitle="Connect a new data source to track" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <Link
            href="/dashboard/sources"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sources
          </Link>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source Type */}
            <Card>
              <CardHeader>
                <CardTitle>Source Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {sourceTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, sourceType: type.id })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.sourceType === type.id
                          ? "border-accent-primary bg-accent-primary/5"
                          : "border-white/5 bg-background-tertiary hover:border-white/20"
                      }`}
                    >
                      <type.icon className={`h-5 w-5 mb-2 ${
                        formData.sourceType === type.id ? "text-accent-primary" : "text-foreground-secondary"
                      }`} />
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-xs text-foreground-muted mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entity">
                    Entity <span className="text-error">*</span>
                  </Label>
                  <Select
                    value={formData.entityId}
                    onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.length > 0 ? (
                        entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No entities found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {entities.length === 0 && (
                    <p className="text-xs text-foreground-muted">
                      <Link href="/dashboard/entities/new" className="text-accent-primary hover:underline">
                        Create an entity first
                      </Link>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Source Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Homepage, Pricing Page, News Feed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {formData.sourceType !== "manual" && (
                  <div className="space-y-2">
                    <Label htmlFor="url">
                      URL <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder={
                        formData.sourceType === "rss"
                          ? "https://example.com/feed.xml"
                          : formData.sourceType === "api"
                          ? "https://api.example.com/data"
                          : "https://example.com"
                      }
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required={formData.sourceType !== "manual"}
                    />
                    {formData.sourceType === "rss" && (
                      <p className="text-xs text-foreground-muted">
                        Enter an RSS or Atom feed URL
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="interval">Refresh Interval</Label>
                  <Select
                    value={formData.refreshInterval}
                    onValueChange={(value) => setFormData({ ...formData, refreshInterval: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {refreshIntervals.map((interval) => (
                        <SelectItem key={interval.value} value={interval.value}>
                          {interval.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Test Connection */}
            {formData.sourceType && formData.url && formData.sourceType !== "manual" && (
              <Card className="bg-background-tertiary/50">
                <CardHeader>
                  <CardTitle className="text-base">Test Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTest}
                      disabled={testing}
                      className="gap-2"
                    >
                      {testing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        "Test Connection"
                      )}
                    </Button>
                    {testResult === "success" && (
                      <span className="flex items-center gap-2 text-success text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Connection successful
                      </span>
                    )}
                    {testResult === "error" && (
                      <span className="flex items-center gap-2 text-error text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Connection failed — check URL
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.sourceType || !formData.name || !formData.entityId}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Source"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
