"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Download,
  Eye,
  MoreVertical,
  Trash2,
  Calendar,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { Report } from "@/lib/types";

// Mock data
const mockReports: Report[] = [
  {
    id: "1",
    user_id: "1",
    entity_ids: ["1", "2", "3"],
    report_type: "weekly_digest",
    title: "Weekly Intelligence Digest",
    content: {},
    html_content: null,
    pdf_url: "/reports/weekly-digest-2024-03-11.pdf",
    file_size_bytes: 245000,
    status: "ready",
    date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    date_to: new Date().toISOString(),
    generated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    entity_ids: ["1"],
    report_type: "entity_report",
    title: "CompetitorX Deep Dive",
    content: {},
    html_content: null,
    pdf_url: "/reports/competitorx-report-2024-03-10.pdf",
    file_size_bytes: 189000,
    status: "ready",
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    date_to: new Date().toISOString(),
    generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sent_at: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "1",
    entity_ids: ["1", "2"],
    report_type: "competitive_analysis",
    title: "Q1 Competitive Landscape",
    content: {},
    html_content: null,
    pdf_url: null,
    file_size_bytes: null,
    status: "generating",
    date_from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    date_to: new Date().toISOString(),
    generated_at: null,
    sent_at: null,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    user_id: "1",
    entity_ids: ["2"],
    report_type: "entity_report",
    title: "Acme Corp Monthly Summary",
    content: {},
    html_content: null,
    pdf_url: "/reports/acme-monthly-2024-02.pdf",
    file_size_bytes: 156000,
    status: "ready",
    date_from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    date_to: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    generated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sent_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getReportTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    weekly_digest: "Weekly Digest",
    monthly_summary: "Monthly Summary",
    entity_report: "Entity Report",
    competitive_analysis: "Competitive Analysis",
    custom: "Custom",
  };
  return labels[type] || type;
};

const getReportTypeBadge = (type: string): "default" | "secondary" | "outline" => {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    weekly_digest: "default",
    monthly_summary: "secondary",
    entity_report: "outline",
    competitive_analysis: "secondary",
    custom: "outline",
  };
  return variants[type] || "outline";
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports);

  return (
    <>
      <Header title="Reports" subtitle={`${reports.filter((r) => r.status === "ready").length} ready reports`} />

      <div className="flex-1 overflow-auto p-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
            <Calendar className="h-4 w-4" />
            Last generated {formatRelativeTime(reports[0]?.generated_at || new Date().toISOString())}
          </div>
          <Link href="/dashboard/reports/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Generate Report
            </Button>
          </Link>
        </div>

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="card-hover">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-accent-primary/10">
                        <FileText className="h-5 w-5 text-accent-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{report.title}</h3>
                          <Badge variant={getReportTypeBadge(report.report_type)} className="text-xs">
                            {getReportTypeLabel(report.report_type)}
                          </Badge>
                          {report.status === "generating" && (
                            <Badge variant="warning" className="text-xs">
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Generating
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-foreground-secondary">
                          <span>
                            {report.date_from && formatDate(report.date_from)} — {formatDate(report.date_to || new Date().toISOString())}
                          </span>
                          {report.pdf_url && (
                            <>
                              <span className="text-foreground-muted">•</span>
                              <span>{formatFileSize(report.file_size_bytes)}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-foreground-muted">
                            Created {formatRelativeTime(report.created_at)}
                          </span>
                          {report.sent_at && (
                            <>
                              <span className="text-foreground-muted">•</span>
                              <span className="text-xs text-foreground-muted">
                                Sent {formatRelativeTime(report.sent_at)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === "ready" ? (
                        <>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </>
                      ) : report.status === "generating" ? (
                        <Button variant="ghost" size="sm" disabled>
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Processing...
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-error">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Regenerate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-error">
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
              <FileText className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No reports yet
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
              Generate your first intelligence report to share insights with your team or clients.
            </p>
            <Link href="/dashboard/reports/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Your First Report
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </>
  );
}
