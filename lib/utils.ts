import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getInsightIcon(type: string): string {
  const icons: Record<string, string> = {
    funding: "💰",
    product: "🚀",
    hiring: "👥",
    pr: "📰",
    leadership: "👔",
    partnership: "🤝",
    anomaly: "🚨",
    comparison: "📊",
    trend: "📈",
    alert: "🔔",
    summary: "📝",
    prediction: "🔮",
  };
  return icons[type] || "📌";
}

export function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    critical: "priority-critical",
    high: "priority-high",
    medium: "priority-medium",
    low: "priority-low",
  };
  return classes[priority] || "priority-medium";
}

export function getStatusDotClass(status: string): string {
  const classes: Record<string, string> = {
    active: "status-active",
    warning: "status-warning",
    error: "status-error",
    inactive: "status-inactive",
  };
  return classes[status] || "status-inactive";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
