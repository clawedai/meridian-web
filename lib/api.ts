import type {
  Entity,
  Source,
  Insight,
  Alert,
  DashboardStats,
  Profile,
  MomentumStats,
  CompetitiveStats,
  CompetitiveGroup,
  PredictionStats,
  PipelineStatus,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "drishti_auth_token";

// ============ TOKEN STORAGE ============

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

// Generic fetch wrapper with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}/api/v1${endpoint}`;

  // Get auth headers (may throw if not authenticated)
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    headers = { ...getAuthHeaders(), ...options.headers };
  } catch {
    // If we're hitting a public endpoint (like login/register), skip auth
    if (!endpoint.includes("/auth/")) {
      throw new Error("Not authenticated");
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// ============ AUTH ============

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(error.detail || "Login failed");
  }

  const data = await response.json();

  // Store token in localStorage
  if (data.access_token) {
    setAuthToken(data.access_token);
  }

  return data;
}

export async function register(
  email: string,
  password: string,
  fullName?: string,
  companyName?: string
) {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      company_name: companyName,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(error.detail || "Registration failed");
  }

  const data = await response.json();

  // Store token in localStorage
  if (data.access_token) {
    setAuthToken(data.access_token);
  }

  return data;
}

export async function logout() {
  clearAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function getCurrentUser(): Promise<Profile> {
  return apiFetch<Profile>("/auth/me");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// ============ DASHBOARD ============

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>("/dashboard/stats");
}

export async function getRecentInsights(limit = 10): Promise<Insight[]> {
  return apiFetch<Insight[]>(`/dashboard/recent-insights?limit=${limit}`);
}

// ============ ENTITIES ============

export async function getEntities(includeArchived = false): Promise<Entity[]> {
  return apiFetch<Entity[]>(`/entities?include_archived=${includeArchived}`);
}

export async function getEntity(id: string): Promise<Entity> {
  return apiFetch<Entity>(`/entities/${id}`);
}

export async function createEntity(entity: Partial<Entity>): Promise<Entity> {
  return apiFetch<Entity>("/entities", {
    method: "POST",
    body: JSON.stringify(entity),
  });
}

export async function updateEntity(id: string, entity: Partial<Entity>): Promise<Entity> {
  return apiFetch<Entity>(`/entities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(entity),
  });
}

export async function deleteEntity(id: string): Promise<void> {
  await apiFetch(`/entities/${id}`, { method: "DELETE" });
}

// ============ SOURCES ============

export async function getSources(params?: { entity_id?: string; is_active?: boolean }): Promise<Source[]> {
  const query = new URLSearchParams();
  if (params?.entity_id) query.append("entity_id", params.entity_id);
  if (params?.is_active !== undefined) query.append("is_active", String(params.is_active));

  const queryString = query.toString();
  return apiFetch<Source[]>(`/sources${queryString ? `?${queryString}` : ""}`);
}

export async function getSource(id: string): Promise<Source> {
  return apiFetch<Source>(`/sources/${id}`);
}

export async function createSource(source: Partial<Source>): Promise<Source> {
  return apiFetch<Source>("/sources", {
    method: "POST",
    body: JSON.stringify(source),
  });
}

export async function updateSource(id: string, source: Partial<Source>): Promise<Source> {
  return apiFetch<Source>(`/sources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(source),
  });
}

export async function deleteSource(id: string): Promise<void> {
  await apiFetch(`/sources/${id}`, { method: "DELETE" });
}

export async function testSource(id: string): Promise<{ success: boolean; error?: string }> {
  return apiFetch(`/sources/${id}/test`, { method: "POST" });
}

export async function refreshSource(id: string): Promise<void> {
  await apiFetch(`/sources/${id}/refresh`, { method: "POST" });
}

// ============ INSIGHTS ============

export async function getInsights(params?: {
  entity_id?: string;
  importance?: string;
  is_read?: boolean;
}): Promise<Insight[]> {
  const query = new URLSearchParams();
  if (params?.entity_id) query.append("entity_id", params.entity_id);
  if (params?.importance) query.append("importance", params.importance);
  if (params?.is_read !== undefined) query.append("is_read", String(params.is_read));

  const queryString = query.toString();
  return apiFetch<Insight[]>(`/insights${queryString ? `?${queryString}` : ""}`);
}

export async function markInsightRead(id: string): Promise<void> {
  await apiFetch(`/insights/${id}/mark-read`, { method: "POST" });
}

export async function markAllInsightsRead(): Promise<void> {
  await apiFetch("/insights/mark-all-read", { method: "POST" });
}

// ============ ALERTS ============

export async function getAlerts(params?: { entity_id?: string; is_active?: boolean }): Promise<Alert[]> {
  const query = new URLSearchParams();
  if (params?.entity_id) query.append("entity_id", params.entity_id);
  if (params?.is_active !== undefined) query.append("is_active", String(params.is_active));

  const queryString = query.toString();
  return apiFetch<Alert[]>(`/alerts${queryString ? `?${queryString}` : ""}`);
}

export async function createAlert(alert: Partial<Alert>): Promise<Alert> {
  return apiFetch<Alert>("/alerts", {
    method: "POST",
    body: JSON.stringify(alert),
  });
}

export async function updateAlert(id: string, alert: Partial<Alert>): Promise<Alert> {
  return apiFetch<Alert>(`/alerts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(alert),
  });
}

export async function deleteAlert(id: string): Promise<void> {
  await apiFetch(`/alerts/${id}`, { method: "DELETE" });
}

export async function toggleAlert(id: string, isActive: boolean): Promise<Alert> {
  return apiFetch<Alert>(`/alerts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}

// ============ REPORTS ============

export async function getReports(): Promise<any[]> {
  return apiFetch<any[]>("/reports");
}

export async function createReport(report: any): Promise<any> {
  return apiFetch<any>("/reports", {
    method: "POST",
    body: JSON.stringify(report),
  });
}

export async function getReport(id: string): Promise<any> {
  return apiFetch<any>(`/reports/${id}`);
}

// ============ PIPELINE (Pillars 2 & 4) ============

export async function triggerPipeline(entityId?: string): Promise<PipelineStatus> {
  const body = entityId ? JSON.stringify({ entity_id: entityId }) : "{}";
  return apiFetch<PipelineStatus>("/pipeline/trigger", {
    method: "POST",
    body,
  });
}

// ============ PILLAR 1: Signal Velocity / Momentum ============

export async function getMomentumStats(): Promise<MomentumStats> {
  return apiFetch<MomentumStats>("/dashboard/momentum");
}

// ============ PILLAR 3: Competitive Benchmarking ============

export async function getCompetitiveStats(): Promise<CompetitiveStats> {
  return apiFetch<CompetitiveStats>("/dashboard/competitive");
}

export async function getCompetitiveGroups(): Promise<CompetitiveGroup[]> {
  return apiFetch<CompetitiveGroup[]>("/competitive-groups");
}

export async function createCompetitiveGroup(data: {
  name: string;
  entity_ids?: string[];
}): Promise<CompetitiveGroup> {
  return apiFetch<CompetitiveGroup>("/competitive-groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCompetitiveGroup(
  id: string,
  data: { name?: string; entity_ids?: string[] }
): Promise<CompetitiveGroup> {
  return apiFetch<CompetitiveGroup>(`/competitive-groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCompetitiveGroup(id: string): Promise<void> {
  await apiFetch(`/competitive-groups/${id}`, { method: "DELETE" });
}

// ============ PILLAR 4: Predictions ============

export async function getPredictionInsights(limit = 20): Promise<Insight[]> {
  return apiFetch<Insight[]>(`/insights/predictions?limit=${limit}`);
}

export async function getPredictionStats(): Promise<PredictionStats> {
  return apiFetch<PredictionStats>("/insights/stats/predictions");
}

// ============ ENTITY HELPERS ============

export async function getEntitySources(entityId: string): Promise<Source[]> {
  return apiFetch<Source[]>(`/entities/${entityId}/sources`);
}

export async function getEntityInsights(
  entityId: string,
  limit = 20
): Promise<Insight[]> {
  return apiFetch<Insight[]>(
    `/entities/${entityId}/insights?limit=${limit}`
  );
}
