"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Video, ArrowRight, Trash2 } from "lucide-react";
import { deleteWorkspace } from "@/app/dashboard/actions";

export function WorkspaceCard({ workspace }: { workspace: any }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const videoCount = workspace.videos?.[0]?.count || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    await deleteWorkspace(workspace.id);
    setIsDeleting(false);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title={`Supprimer "${workspace.name}" ?`}
        description="Cette action est irréversible. Toutes les vidéos et données de production associées seront définitivement perdues."
        confirmLabel="Oui, supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <Card
        className={`group relative overflow-hidden bg-[#141418] border-border/70 hover:border-red-600/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/10 rounded-2xl ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
      >
        <Link href={`/workspace/${workspace.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">Ouvrir {workspace.name}</span>
        </Link>

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            {/* YouTube 4-box Menu Icon Badge */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform">
              <div className="grid grid-cols-2 gap-1 p-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                <div className="w-1.5 h-1.5 bg-white rounded-xs" />
              </div>
            </div>

            <div className="flex items-center gap-2 z-20">
              <span className="inline-flex items-center rounded-full bg-red-600/10 border border-red-600/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                {workspace.niche}
              </span>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Supprimer ce workspace"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <CardTitle className="text-xl font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
              {workspace.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-red-500" />
              {videoCount} vidéo{videoCount > 1 ? "s" : ""} en cours
            </CardDescription>
          </div>
        </CardHeader>

        <CardFooter className="pt-3 pb-3 text-xs text-muted-foreground border-t border-border/40 bg-[#101014]/60 flex items-center justify-between">
          <span>Créé {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true, locale: fr })}</span>
          <span className="text-red-500 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ouvrir <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </CardFooter>
      </Card>
    </>
  );
}
