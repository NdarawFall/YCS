"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Video, ArrowRight, Trash2, Tv2 } from "lucide-react";
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

      <div className={`group relative overflow-hidden card-gradient-border transition-all duration-300 hover:-translate-y-2 cursor-pointer ${isDeleting ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Red accent top glow on hover */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: 'radial-gradient(ellipse, rgba(255,0,0,0.35), transparent)' }}
        />

        <Link href={`/workspace/${workspace.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">Ouvrir {workspace.name}</span>
        </Link>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/40 group-hover:scale-110 transition-transform duration-300">
              <div className="grid grid-cols-2 gap-1 p-1">
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 z-20">
              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-400 backdrop-blur-sm">
                {workspace.niche}
              </span>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-all cursor-pointer"
                title="Supprimer ce workspace"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-red-400 transition-colors duration-200 mb-1">
            {workspace.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Video className="h-3 w-3 text-red-500/70" />
            <span>{videoCount} vidéo{videoCount > 1 ? "s" : ""} en production</span>
          </div>
        </div>

        {/* Card footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/30">
            {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true, locale: fr })}
          </span>
          <span className="text-red-500 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
            Ouvrir <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </>
  );
}
