"use client";

import { useState } from "react";
import { User, CreditCard, Key, Bell, Users, Shield, Check } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simple separator component
const Divider = () => <div className="h-px w-full bg-white/5 my-4" />;

type TabType = "profile" | "billing" | "api" | "notifications" | "team";

const tabs = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "billing" as const, label: "Billing", icon: CreditCard },
  { id: "api" as const, label: "API Keys", icon: Key },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "team" as const, label: "Team", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-white/5 p-6">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-w-3xl">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-accent-primary flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">JD</span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Change avatar
                        </Button>
                        <p className="text-xs text-foreground-muted mt-1">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@acme.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company name</Label>
                      <Input id="company" defaultValue="Acme Inc" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue="saas">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Divider />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Current Plan</p>
                        <p className="text-sm text-foreground-secondary">
                          You are on the <span className="text-accent-primary font-medium">Growth</span> plan
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Upgrade Plan
                      </Button>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="gap-2">
                        {saved && <Check className="h-4 w-4" />}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">Growth Plan</h3>
                          <Badge variant="success">Active</Badge>
                        </div>
                        <p className="text-sm text-foreground-secondary mt-1">
                          $500/month • Billed monthly
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">$500</p>
                        <p className="text-xs text-foreground-muted">per month</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="p-4 rounded-lg bg-background-tertiary">
                        <p className="text-2xl font-bold text-foreground">20</p>
                        <p className="text-sm text-foreground-secondary">Entities</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background-tertiary">
                        <p className="text-2xl font-bold text-foreground">40</p>
                        <p className="text-sm text-foreground-secondary">Data Sources</p>
                      </div>
                      <div className="p-4 rounded-lg bg-background-tertiary">
                        <p className="text-2xl font-bold text-foreground">90</p>
                        <p className="text-sm text-foreground-secondary">Days Retention</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="ghost" className="text-error">Cancel Subscription</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "Mar 1, 2024", amount: "$500.00", status: "Paid" },
                        { date: "Feb 1, 2024", amount: "$500.00", status: "Paid" },
                        { date: "Jan 1, 2024", amount: "$500.00", status: "Paid" },
                      ].map((invoice, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                          <div>
                            <p className="font-medium text-foreground">{invoice.date}</p>
                            <p className="text-sm text-foreground-secondary">Growth Plan</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="success">{invoice.status}</Badge>
                            <p className="font-medium text-foreground">{invoice.amount}</p>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Use API keys to access Almanac programmatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-background-tertiary border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">Production Key</p>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm font-mono text-foreground-secondary bg-background p-2 rounded mb-3">
                        mrd_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
                      </p>
                      <p className="text-xs text-foreground-muted">
                        Created Feb 15, 2024 • Last used 2 hours ago
                      </p>
                    </div>

                    <Button>Generate New Key</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                      Integrate Almanac with your applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground-secondary mb-4">
                      Full API documentation coming soon. Contact support for early access.
                    </p>
                    <Button variant="outline">View API Docs</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Weekly digest", description: "Summary of all activity", enabled: true },
                      { label: "Critical alerts", description: "High and critical importance insights", enabled: true },
                      { label: "New insights", description: "All new insights from tracked entities", enabled: false },
                      { label: "Weekly report", description: "Automated report generation and delivery", enabled: true },
                      { label: "Marketing emails", description: "Tips, tutorials, and product updates", enabled: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-foreground-secondary">{item.description}</p>
                        </div>
                        <Button
                          variant={item.enabled ? "secondary" : "outline"}
                          size="sm"
                        >
                          {item.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alert Frequency</CardTitle>
                    <CardDescription>
                      How often should we send alert notifications?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately</SelectItem>
                        <SelectItem value="hourly">Hourly digest</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          Manage who has access to your account.
                        </CardDescription>
                      </div>
                      <Button size="sm">Invite Member</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-white">JD</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">John Doe</p>
                          <p className="text-sm text-foreground-secondary">john@acme.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Owner</Badge>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-foreground-muted flex items-center justify-center">
                          <span className="text-sm font-bold text-background">JS</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Jane Smith</p>
                          <p className="text-sm text-foreground-secondary">jane@acme.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Admin</Badge>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-warning/5 border-warning/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Upgrade for Team Features</p>
                        <p className="text-sm text-foreground-secondary mt-1">
                          The Scale plan includes 5 team seats, white-label reports, and dedicated support.
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Upgrade to Scale
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
