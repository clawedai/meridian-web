"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
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
import { createEntity } from "@/lib/api";

const industries = [
  "SaaS",
  "Enterprise Software",
  "Technology",
  "AI/ML",
  "E-commerce",
  "Fintech",
  "Healthcare",
  "Education",
  "Media",
  "Gaming",
  "Other",
];

export default function NewEntityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    industry: "",
    description: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated tags to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Create entity via API
      await createEntity({
        name: formData.name,
        website: formData.website || undefined,
        industry: formData.industry || undefined,
        description: formData.description || undefined,
        tags: tagsArray,
      });

      // Redirect to entities list on success
      router.push("/dashboard/entities");
    } catch (err: any) {
      setError(err.message || "Failed to create entity. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Add Entity" subtitle="Track a new competitor or company" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          {/* Back Link */}
          <Link
            href="/dashboard/entities"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to entities
          </Link>

          {error && (
            <div className="mb-4 p-3 rounded-sm bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Company Name <span className="text-error">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Acme Corp"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="pl-10"
                    />
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  </div>
                  <p className="text-xs text-foreground-muted">
                    We'll use this to automatically set up data sources
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Brief description of this company and why you're tracking them..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="flex min-h-[100px] w-full rounded-sm border border-foreground-muted bg-background-tertiary px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2 focus:ring-offset-background transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="competitor, enterprise, funded"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                  <p className="text-xs text-foreground-muted">
                    Comma-separated tags to help organize your entities
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources Preview */}
            <Card className="bg-background-tertiary/50">
              <CardHeader>
                <CardTitle className="text-base">
                  Auto-Discovery Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-secondary mb-4">
                  Based on your input, we'll automatically set up:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-foreground-secondary">
                    <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                    </span>
                    Website homepage monitoring
                  </li>
                  <li className="flex items-center gap-2 text-foreground-secondary">
                    <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                    </span>
                    LinkedIn company page (if available)
                  </li>
                  <li className="flex items-center gap-2 text-foreground-secondary">
                    <span className="w-4 h-4 rounded-full bg-warning/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-warning"></span>
                    </span>
                    News/RSS feed monitoring
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formData.name}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Entity"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
