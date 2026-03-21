// Types for Meridian

export type SubscriptionTier = "starter" | "growth" | "scale";
export type SubscriptionStatus = "active" | "trialing" | "cancelled" | "past_due";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  company_industry: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface Entity {
  id: string;
  user_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  tags: string[];
  logo_url: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type SourceType = "rss" | "scrape" | "api" | "manual";
export type SourceStatus = "active" | "warning" | "error" | "inactive";

export interface Source {
  id: string;
  user_id: string;
  entity_id: string;
  name: string;
  source_type: SourceType;
  url: string | null;
  config: Record<string, any>;
  refresh_interval_minutes: number;
  status: SourceStatus;
  last_fetched_at: string | null;
  last_error: string | null;
  fetch_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InsightType =
  | "summary"
  | "anomaly"
  | "comparison"
  | "trend"
  | "alert"
  | "funding"
  | "product"
  | "hiring"
  | "pr"
  | "leadership"
  | "partnership"
  | "prediction";

export type InsightImportance = "low" | "medium" | "high" | "critical";

export interface Insight {
  id: string;
  user_id: string;
  entity_id: string;
  entity?: Entity;
  insight_type: InsightType;
  title: string;
  content: string;
  summary: string | null;
  confidence: number;
  importance: InsightImportance;
  source_ids: string[];
  is_read: boolean;
  is_archived: boolean;
  generated_at: string;
  created_at: string;
}

export type AlertConditionType = "keyword" | "change" | "metric" | "pattern" | "schedule";
export type AlertChannel = "email" | "webhook" | "dashboard";

export interface Alert {
  id: string;
  user_id: string;
  entity_id: string | null;
  entity?: Entity;
  name: string;
  description: string | null;
  alert_condition_type: AlertConditionType;
  condition_config: Record<string, any>;
  channels: AlertChannel[];
  webhook_url: string | null;
  email_frequency: string;
  is_active: boolean;
  last_triggered_at: string | null;
  trigger_count: number;
  created_at: string;
  updated_at: string;
}

export type ReportType = "weekly_digest" | "monthly_summary" | "entity_report" | "competitive_analysis" | "custom";
export type ReportStatus = "generating" | "ready" | "failed";

export interface Report {
  id: string;
  user_id: string;
  entity_ids: string[];
  report_type: ReportType;
  title: string;
  content: Record<string, any>;
  html_content: string | null;
  pdf_url: string | null;
  file_size_bytes: number | null;
  status: ReportStatus;
  date_from: string | null;
  date_to: string | null;
  generated_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  entity_count: number;
  active_source_count: number;
  unread_insight_count: number;
  active_alert_count: number;
  insights_this_week: number;
  last_insight_at: string | null;
}

// ─── Pillar 1: Signal Velocity ───────────────────────────────────────────────
export type MomentumDirection = "accelerating" | "stable" | "decelerating";

export interface MomentumEntity {
  entity_id: string;
  entity_name: string;
  industry: string | null;
  insights_this_week: number;
  insights_last_week: number;
  velocity_percent: number;
  momentum_score: number;
  direction: MomentumDirection;
  top_insight_types: string[];
  avg_importance: string;
}

export interface MomentumStats {
  top_movers: MomentumEntity[];
  top_decelerators: MomentumEntity[];
  most_active: MomentumEntity[];
  industry_heat_index: number;
  industry_heat_change: number;
  total_entities_tracked: number;
}

// ─── Pillar 3: Competitive Benchmarking ───────────────────────────────────────
export interface CompetitiveEntity {
  entity_id: string;
  entity_name: string;
  industry: string | null;
  insights_this_week: number;
  insights_last_week: number;
  share_of_attention: number;
  competitive_delta: number;
  rank_in_group: number;
  group_name: string;
  group_type: "industry" | "manual";
}

export interface CompetitiveGroupStats {
  group_name: string;
  group_type: "industry" | "manual";
  total_entities: number;
  total_signals_this_week: number;
  total_signals_last_week: number;
  industry_heat_index: number;
  heat_change_percent: number;
  top_player: string | null;
  fastest_rising: string | null;
}

export interface CompetitiveStats {
  industry_benchmarks: CompetitiveGroupStats[];
  manual_groups: CompetitiveGroupStats[];
  top_entities: CompetitiveEntity[];
  total_industries_tracked: number;
  total_groups: number;
}

export interface CompetitiveGroup {
  id: string;
  user_id: string;
  name: string;
  entity_count: number;
  created_at: string;
}

// ─── Pillar 4: Predictions ────────────────────────────────────────────────────
export interface PredictionStats {
  total_predictions: number;
  high_confidence_predictions: number;
  predictions_by_entity: number;
  pattern_count: number;
  most_common_patterns: string[];
}

// ─── Pipeline ────────────────────────────────────────────────────────────────
export interface PipelineStatus {
  entities_processed: number;
  sources_processed: number;
  insights_generated: number;
  anomalies_detected: number;
  predictions_generated: number;
  errors: string[];
  completed_at: string;
  entity_name: string | null;
  entity_id: string | null;
}
