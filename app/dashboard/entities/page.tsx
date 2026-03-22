"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Plus, MoreVertical, ExternalLink, Archive, Trash2, Loader2 } from "lucide-react";
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
import { getEntities, deleteEntity, updateEntity } from "@/lib/api";
import type { Entity } from "@/lib/types";

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadEntities();
  }, [showArchived]);

  const loadEntities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntities(showArchived);
      setEntities(data);
    } catch (err: any) {
      setError(err.message || "Failed to load entities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this entity?")) {
      try {
        await deleteEntity(id);
        loadEntities();
      } catch (err) {
        alert("Failed to delete entity");
      }
    }
  };

  const handleArchive = async (id: string, currentlyArchived: boolean) => {
    try {
      await updateEntity(id, { is_archived: !currentlyArchived });
      loadEntities();
    } catch (err) {
      alert("Failed to archive entity");
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Entities" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Entities" subtitle="Error" />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md p-8 text-center">
            <p className="text-error mb-4">{error}</p>
            <Button onClick={loadEntities}>Try Again</Button>
          </Card>
        </div>
      </>
    );
  }

  const filteredEntities = entities.filter((e) =>
    showArchived ? e.is_archived : !e.is_archived
  );

  return (
    <>
      <Header
        title="Entities"
        subtitle={`${filteredEntities.length} ${showArchived ? "archived" : "active"}`}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Button
              variant={showArchived ? "outline" : "secondary"}
              size="sm"
              onClick={() => setShowArchived(false)}
            >
              Active
            </Button>
            <Button
              variant={showArchived ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowArchived(true)}
            >
              Archived
            </Button>
          </div>
          <Link href="/dashboard/entities/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entity
            </Button>
          </Link>
        </div>

        {/* Entity Grid */}
        {filteredEntities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map((entity) => (
              <Card key={entity.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-primary/10">
                        <Building2 className="h-5 w-5 text-accent-primary" />
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/entities/${entity.id}`}
                          className="font-medium text-foreground hover:text-accent-primary transition-colors"
                        >
                          {entity.name}
                        </Link>
                        {entity.industry && (
                          <p className="text-xs text-foreground-muted">
                            {entity.industry}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/entities/${entity.id}`}
                            className="flex items-center"
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {entity.website && (
                          <DropdownMenuItem asChild>
                            <a
                              href={entity.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Website
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-foreground-secondary"
                          onClick={() => handleArchive(entity.id, entity.is_archived)}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          {entity.is_archived ? "Unarchive" : "Archive"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-error"
                          onClick={() => handleDelete(entity.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {entity.description && (
                    <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
                      {entity.description}
                    </p>
                  )}

                  {entity.tags && entity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {entity.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entity.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entity.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span>Added {formatRelativeTime(entity.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {showArchived ? "No archived entities" : "No entities yet"}
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-sm mx-auto">
              {showArchived
                ? "Archived entities will appear here."
                : "Start tracking competitors and companies by adding your first entity."}
            </p>
            {!showArchived && (
              <Link href="/dashboard/entities/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Entity
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
