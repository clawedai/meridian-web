"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Zap,
  ToggleLeft,
  ToggleRight,
  Mail,
  Webhook,
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
import type { Alert } from "@/lib/types";

// Mock data
const mockAlerts: Alert[] = [
  {
    id: "1",
    user_id: "1",
    entity_id: "1",
    name: "CompetitorX Funding Alert",
    description: "Notify when CompetitorX raises new funding",
    alert_condition_type: "keyword",
    condition_config: { keyword: "funding", match_type: "contains" },
    channels: ["email", "dashboard"],
    webhook_url: null,
    email_frequency: "immediate",
    is_active: true,
    last_triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    trigger_count: 3,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    entity_id: "2",
    name: "Acme Corp Product Launch",
    description: "Track new product announcements from Acme Corp",
    alert_condition_type: "keyword",
    condition_config: { keyword: "launch", match_type: "contains" },
    channels: ["email", "webhook"],
    webhook_url: "https://your-app.com/webhook/drishti",
    email_frequency: "immediate",
    is_active: true,
    last_triggered_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    trigger_count: 12,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "1",
    entity_id: null,
    name: "Weekly Market Summary",
    description: "Send weekly digest of all tracked entities",
    alert_condition_type: "schedule",
    condition_config: { day: "monday", time: "09:00" },
    channels: ["email"],
    webhook_url: null,
    email_frequency: "weekly",
    is_active: true,
    last_triggered_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trigger_count: 8,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "1",
    entity_id: "3",
    name: "BigCo Website Change",
    description: "Alert on any significant website changes",
    alert_condition_type: "change",
    condition_config: { detect: "content_change", threshold: 0.2 },
    channels: ["email"],
    webhook_url: null,
    email_frequency: "daily",
    is_active: false,
    last_triggered_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    trigger_count: 5,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return <Mail className="h-3 w-3" />;
    case "webhook":
      return <Webhook className="h-3 w-3" />;
    default:
      return <Bell className="h-3 w-3" />;
  }
};

const getAlertTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    keyword: "Keyword",
    change: "Content Change",
    metric: "Metric Threshold",
    pattern: "Pattern",
    schedule: "Scheduled",
  };
  return labels[type] || type;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showActive, setShowActive] = useState(true);

  const filteredAlerts = alerts.filter((alert) =>
    showActive ? alert.is_active : !alert.is_active
  );

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  return (
    <>
      <Header
        title="Alerts"
        subtitle={`${alerts.filter((a) => a.is_active).length} active alerts`}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Button
              variant={showActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowActive(true)}
            >
              Active ({alerts.filter((a) => a.is_active).length})
            </Button>
            <Button
              variant={!showActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowActive(false)}
            >
              Inactive ({alerts.filter((a) => !a.is_active).length})
            </Button>
          </div>
          <Link href="/dashboard/alerts/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Alert
            </Button>
          </Link>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={!alert.is_active ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          alert.is_active ? "bg-accent-primary/10" : "bg-foreground-muted/10"
                        }`}
                      >
                        <Zap
                          className={`h-5 w-5 ${
                            alert.is_active ? "text-accent-primary" : "text-foreground-muted"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{alert.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getAlertTypeLabel(alert.alert_condition_type)}
                          </Badge>
                        </div>
                        {alert.description && (
                          <p className="text-sm text-foreground-secondary mt-1">
                            {alert.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          {/* Channels */}
                          <div className="flex items-center gap-1">
                            {alert.channels.map((channel) => (
                              <span
                                key={channel}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-background-tertiary text-foreground-secondary"
                              >
                                {getChannelIcon(channel)}
                                {channel}
                              </span>
                            ))}
                          </div>
                          {/* Stats */}
                          <span className="text-xs text-foreground-muted">
                            Triggered {alert.trigger_count} times
                          </span>
                          {alert.last_triggered_at && (
                            <span className="text-xs text-foreground-muted">
                              Last: {formatRelativeTime(alert.last_triggered_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                        className="gap-1"
                      >
                        {alert.is_active ? (
                          <>
                            <ToggleRight className="h-5 w-5 text-success" />
                            <span className="text-xs text-success">On</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-5 w-5 text-foreground-muted" />
                            <span className="text-xs text-foreground-muted">Off</span>
                          </>
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Zap className="h-4 w-4 mr-2" />
                            Test Alert
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
              <Bell className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {showActive ? "No active alerts" : "No inactive alerts"}
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
              {showActive
                ? "Create your first alert to start receiving notifications when important events occur."
                : "Inactive alerts will appear here."}
            </p>
            {showActive && (
              <Link href="/dashboard/alerts/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Alert
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
