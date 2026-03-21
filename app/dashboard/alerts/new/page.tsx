"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Search,
  GitCompare,
  BarChart3,
  Calendar,
  Loader2,
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

const alertTypes = [
  {
    id: "keyword",
    label: "Keyword Alert",
    description: "Trigger when specific text appears",
    icon: Search,
  },
  {
    id: "change",
    label: "Content Change",
    description: "Detect when webpage content changes",
    icon: GitCompare,
  },
  {
    id: "metric",
    label: "Metric Threshold",
    description: "Alert on numeric value changes",
    icon: BarChart3,
  },
  {
    id: "schedule",
    label: "Scheduled Reminder",
    description: "Get reminded on a schedule",
    icon: Calendar,
  },
];

const alertChannels = [
  { id: "email", label: "Email" },
  { id: "webhook", label: "Webhook" },
  { id: "dashboard", label: "In-app" },
];

export default function NewAlertPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    alertType: "",
    entityId: "",
    name: "",
    description: "",
    keyword: "",
    channels: ["email"],
    webhookUrl: "",
    frequency: "immediate",
  });

  const toggleChannel = (channel: string) => {
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter((c) => c !== channel),
      });
    } else {
      setFormData({
        ...formData,
        channels: [...formData.channels, channel],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    router.push("/dashboard/alerts");
  };

  return (
    <>
      <Header title="Create Alert" subtitle="Set up notifications for important events" />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <Link
            href="/dashboard/alerts"
            className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to alerts
          </Link>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert Type */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Type</CardTitle>
                <CardDescription>Choose how you want to be alerted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {alertTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, alertType: type.id })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.alertType === type.id
                          ? "border-accent-primary bg-accent-primary/5"
                          : "border-white/5 bg-background-tertiary hover:border-white/20"
                      }`}
                    >
                      <type.icon className={`h-5 w-5 mb-2 ${
                        formData.alertType === type.id ? "text-accent-primary" : "text-foreground-secondary"
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
                <CardTitle>Alert Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entity">Entity (Optional)</Label>
                  <Select
                    value={formData.entityId}
                    onValueChange={(value) => setFormData({ ...formData, entityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All entities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All entities</SelectItem>
                      <SelectItem value="1">CompetitorX</SelectItem>
                      <SelectItem value="2">Acme Corp</SelectItem>
                      <SelectItem value="3">BigCo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Alert Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., CompetitorX Funding Alert"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of this alert"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {formData.alertType === "keyword" && (
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Keyword to Monitor</Label>
                    <Input
                      id="keyword"
                      placeholder="e.g., funding, launch, hiring"
                      value={formData.keyword}
                      onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                      required
                    />
                    <p className="text-xs text-foreground-muted">
                      Alert will trigger when this keyword appears in any tracked content
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Send via</Label>
                  <div className="flex gap-3">
                    {alertChannels.map((channel) => (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => toggleChannel(channel.id)}
                        className={`px-4 py-2 rounded-sm border text-sm font-medium transition-colors ${
                          formData.channels.includes(channel.id)
                            ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                            : "border-white/5 bg-background-tertiary text-foreground-secondary hover:border-white/20"
                        }`}
                      >
                        {channel.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.channels.includes("webhook") && (
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      type="url"
                      placeholder="https://your-app.com/webhook"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="frequency">Alert Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately</SelectItem>
                      <SelectItem value="hourly">Hourly digest</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
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
                disabled={loading || !formData.alertType || !formData.name}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
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
