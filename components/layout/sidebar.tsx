"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Rss,
  Lightbulb,
  Bell,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  Zap,
  Target,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Entities", href: "/dashboard/entities", icon: Building2 },
  { name: "Sources", href: "/dashboard/sources", icon: Rss },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const pillarsNav = [
  {
    name: "Signal Velocity",
    href: "/dashboard/pillars/momentum",
    icon: TrendingUp,
    badge: "P1",
  },
  {
    name: "Competitive",
    href: "/dashboard/pillars/competitive",
    icon: Target,
    badge: "P3",
  },
  {
    name: "Predictions",
    href: "/dashboard/pillars/predictions",
    icon: Brain,
    badge: "P4",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-60 flex-col bg-background-secondary border-r border-white/5">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-primary">
          <span className="text-lg font-bold text-white">D</span>
        </div>
        <div>
          <span className="text-lg font-semibold text-foreground">Drishti</span>
          <p className="text-[10px] text-gray-500 leading-tight">Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}

        {/* Intelligence Pillars Divider */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Intelligence Pillars
          </p>
        </div>

        {pillarsNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary">
                {item.badge}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-foreground-secondary hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
