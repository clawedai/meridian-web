"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Calendar,
  Check,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  {
    id: "weekly_digest",
    label: "Weekly Digest",
    description: "Summary of all activity over the past week",
  },
  {
    id: "entity_report",
    label: "Entity Report",
    description: "Deep dive into a specific competitor or company",
  },
  {
    id: "competitive_analysis",
    label: "Competitive Analysis",
    description: "Compare multiple entities side by side",
  },
  {
    id: "custom",
    label: "Custom Report",
    description: "Build a custom report with selected metrics",
  },
];

export default function NewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportType: "",
    entityIds: [] as string[],
    title: "",
    dateRange: "7",
  });

  const toggleEntity = (id: string) => {
    if (formData.entityIds.includes(id)) {
      setFormData({
        ...formData,
        entityIds: formData.entityIds.filter((e) => e !== id),
      });
    } else {
      setFormData({
        ...formData,
        entityIds: [...formData.entityIds, id],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    router.push("/dashboard/reports");
  };

  return (
    <>
      <Header title="Generate Report" subtitle="Create a new intelligence report" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to reports
          </Link>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type */}
            <Card>
              <CardHeader>
                <CardTitle>Report Type</CardTitle>
                <CardDescription>Choose the type of report you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, reportType: type.id })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.reportType === type.id
                          ? "border-accent-primary bg-accent-primary/5"
                          : "border-white/5 bg-background-tertiary hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className={`h-4 w-4 ${
                          formData.reportType === type.id ? "text-accent-primary" : "text-foreground-secondary"
                        }`} />
                        <p className="font-medium text-foreground">{type.label}</p>
                      </div>
                      <p className="text-xs text-foreground-muted">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Details */}
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Weekly Intelligence Digest - March 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select
                    value={formData.dateRange}
                    onValueChange={(value) => setFormData({ ...formData, dateRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="14">Last 14 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.reportType === "entity_report" || formData.reportType === "competitive_analysis") && (
                  <div className="space-y-2">
                    <Label>Select Entities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "1", name: "CompetitorX" },
                        { id: "2", name: "Acme Corp" },
                        { id: "3", name: "BigCo" },
                        { id: "4", name: "StartupY" },
                      ].map((entity) => (
                        <button
                          key={entity.id}
                          type="button"
                          onClick={() => toggleEntity(entity.id)}
                          className={`p-3 rounded-sm border text-left transition-colors flex items-center justify-between ${
                            formData.entityIds.includes(entity.id)
                              ? "border-accent-primary bg-accent-primary/5"
                              : "border-white/5 bg-background-tertiary"
                          }`}
                        >
                          <span className="text-sm text-foreground">{entity.name}</span>
                          {formData.entityIds.includes(entity.id) && (
                            <Check className="h-4 w-4 text-accent-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                    {formData.reportType === "competitive_analysis" && formData.entityIds.length < 2 && (
                      <p className="text-xs text-warning">
                        Select at least 2 entities for competitive analysis
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-background-tertiary/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Report Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-foreground-secondary">
                  <div className="flex justify-between">
                    <span>Report Type:</span>
                    <span className="text-foreground">
                      {reportTypes.find((t) => t.id === formData.reportType)?.label || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Title:</span>
                    <span className="text-foreground">{formData.title || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Range:</span>
                    <span className="text-foreground">
                      {formData.dateRange === "custom" ? "Custom" : `Last ${formData.dateRange} days`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entities:</span>
                    <span className="text-foreground">
                      {formData.entityIds.length > 0
                        ? `${formData.entityIds.length} selected`
                        : "All entities"}
                    </span>
                  </div>
                </div>
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
              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.reportType ||
                  !formData.title ||
                  (formData.reportType === "competitive_analysis" && formData.entityIds.length < 2)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
