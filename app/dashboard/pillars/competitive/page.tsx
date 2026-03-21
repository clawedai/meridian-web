"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, TrendingDown, Users, Building2, Plus, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCompetitiveStats, getCompetitiveGroups, createCompetitiveGroup, deleteCompetitiveGroup, getEntities } from "@/lib/api";
import type { CompetitiveStats, CompetitiveGroup, CompetitiveEntity, CompetitiveGroupStats, Entity } from "@/lib/types";

export default function CompetitivePage() {
  const [stats, setStats] = useState<CompetitiveStats | null>(null);
  const [groups, setGroups] = useState<CompetitiveGroup[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, groupsData, entitiesData] = await Promise.all([
        getCompetitiveStats(),
        getCompetitiveGroups(),
        getEntities(),
      ]);
      setStats(statsData);
      setGroups(groupsData);
      setEntities(entitiesData);
    } catch (err: any) {
      console.error("Failed to load competitive data:", err);
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (name: string, entityIds: string[]) => {
    try {
      await createCompetitiveGroup({ name, entity_ids: entityIds });
      setShowCreateModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create group");
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Delete this competitive group?")) return;
    try {
      await deleteCompetitiveGroup(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Competitive Benchmarking" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-foreground-muted">Loading competitive data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Competitive Benchmarking" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-error">{error}</div>
          <button onClick={loadData} className="text-accent-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Competitive Benchmarking"
        description="Compare entity performance against industry peers and custom groups"
        actions={
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Group
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Industries Tracked</div>
              <div className="text-2xl font-bold text-foreground">{stats.total_industries_tracked}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Manual Groups</div>
              <div className="text-2xl font-bold text-foreground">{stats.total_groups}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Top Entities</div>
              <div className="text-2xl font-bold text-foreground">{stats.top_entities.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-4">
              <div className="text-foreground-muted text-xs font-medium mb-1">Top Entity</div>
              <div className="text-sm font-semibold text-foreground truncate">
                {stats.top_entities[0]?.entity_name || "—"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manual Groups */}
        {stats.manual_groups.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-accent-primary" />
              Manual Competitive Groups
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.manual_groups.map((group) => (
                <GroupCard key={group.group_name} group={group} onDelete={handleDeleteGroup} />
              ))}
            </div>
          </div>
        )}

        {/* Industry Benchmarks */}
        {stats.industry_benchmarks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-info" />
              Industry Benchmarks (Auto-Grouped)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.industry_benchmarks.map((group) => (
                <GroupCard key={group.group_name} group={group} />
              ))}
            </div>
          </div>
        )}

        {/* Top Entities */}
        {stats.top_entities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent-secondary" />
              Top Entities by Share of Attention
            </h3>
            <Card className="bg-background-secondary border-white/5">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs font-medium text-foreground-muted px-4 py-3">#</th>
                      <th className="text-left text-xs font-medium text-foreground-muted px-4 py-3">Entity</th>
                      <th className="text-left text-xs font-medium text-foreground-muted px-4 py-3">Group</th>
                      <th className="text-right text-xs font-medium text-foreground-muted px-4 py-3">This Week</th>
                      <th className="text-right text-xs font-medium text-foreground-muted px-4 py-3">Share</th>
                      <th className="text-right text-xs font-medium text-foreground-muted px-4 py-3">Delta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_entities.slice(0, 10).map((entity, i) => (
                      <tr key={entity.entity_id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                        <td className="px-4 py-3 text-foreground-muted text-sm">{i + 1}</td>
                        <td className="px-4 py-3 text-foreground font-medium text-sm">{entity.entity_name}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] ${entity.group_type === "manual" ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20" : "bg-info/10 text-info border-info/20"}`}>
                            {entity.group_name}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground text-sm text-right font-mono">{entity.insights_this_week}</td>
                        <td className="px-4 py-3 text-foreground text-sm text-right font-mono">{(entity.share_of_attention * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-right">
                          {entity.competitive_delta !== 0 && (
                            <span className={`text-xs font-mono flex items-center justify-end gap-1 ${entity.competitive_delta > 0 ? "text-success" : "text-error"}`}>
                              {entity.competitive_delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {entity.competitive_delta > 0 ? "+" : ""}{(entity.competitive_delta * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {stats.industry_benchmarks.length === 0 && stats.manual_groups.length === 0 && (
          <Card className="bg-background-secondary border-white/5">
            <CardContent className="p-8 text-center">
              <Target className="h-10 w-10 text-foreground-muted mx-auto mb-3" />
              <div className="text-foreground font-medium mb-1">No competitive data yet</div>
              <div className="text-foreground-muted text-sm">
                Add entities and sources to start tracking competitive benchmarks
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          entities={entities}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}

function GroupCard({
  group,
  onDelete,
}: {
  group: CompetitiveGroupStats;
  onDelete?: (id: string) => void;
}) {
  const heatPercent = Math.min(Math.max(group.industry_heat_index, 0), 100);

  return (
    <Card className="bg-background-secondary border-white/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`text-[10px] ${group.group_type === "manual" ? "bg-accent-primary/10 text-accent-primary border-accent-primary/20" : "bg-info/10 text-info border-info/20"}`}>
              {group.group_type}
            </Badge>
            <CardTitle className="text-sm font-medium">{group.group_name}</CardTitle>
          </div>
          {onDelete && group.group_type === "manual" && (
            <button onClick={() => onDelete(group.group_name)} className="text-foreground-muted hover:text-error">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-foreground-muted">Entities</div>
            <div className="text-lg font-bold text-foreground">{group.total_entities}</div>
          </div>
          <div>
            <div className="text-xs text-foreground-muted">Signals (W)</div>
            <div className="text-lg font-bold text-foreground">{group.total_signals_this_week}</div>
          </div>
          <div>
            <div className="text-xs text-foreground-muted">Heat</div>
            <div className={`text-lg font-bold ${group.heat_change_percent >= 0 ? "text-success" : "text-error"}`}>
              {group.heat_change_percent >= 0 ? "+" : ""}{group.heat_change_percent.toFixed(1)}%
            </div>
          </div>
        </div>
        <div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
              style={{ width: `${heatPercent}%` }}
            />
          </div>
        </div>
        {group.fastest_rising && (
          <div className="flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" />
            Rising: {group.fastest_rising}
          </div>
        )}
        {group.top_player && (
          <div className="text-xs text-foreground-muted">
            Leader: <span className="text-foreground">{group.top_player}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CreateGroupModal({
  entities,
  onClose,
  onCreate,
}: {
  entities: Entity[];
  onClose: () => void;
  onCreate: (name: string, entityIds: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleEntity = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter a group name");
      return;
    }
    onCreate(name.trim(), selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background-secondary border border-white/10 rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Create Competitive Group</h2>
          <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-foreground-muted mb-1 block">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. EV Incumbents"
            className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent-primary"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-foreground-muted mb-2 block">
            Select Entities ({selected.length} selected)
          </label>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {entities.length === 0 ? (
              <div className="text-foreground-muted text-sm py-4 text-center">No entities found</div>
            ) : (
              entities.map((entity) => (
                <label key={entity.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(entity.id)}
                    onChange={() => toggleEntity(entity.id)}
                    className="accent-accent-primary"
                  />
                  <span className="text-sm text-foreground">{entity.name}</span>
                  {entity.industry && (
                    <span className="text-xs text-foreground-muted ml-auto">{entity.industry}</span>
                  )}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1">Create Group</Button>
        </div>
      </div>
    </div>
  );
}
