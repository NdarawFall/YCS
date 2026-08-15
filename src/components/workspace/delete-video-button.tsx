"use client";

import { useState } from "react";
import { deleteVideo } from "@/app/workspace/actions-video";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Trash2 } from "lucide-react";

export function DeleteVideoButton({ videoId, workspaceId }: { videoId: string; workspaceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    await deleteVideo(videoId, workspaceId);
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Supprimer cette vidéo ?"
        description="Toutes les données de production (script, voix off, miniatures...) seront définitivement supprimées. Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer cette vidéo"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {loading ? "Suppression..." : "Supprimer"}
      </button>
    </>
  );
}
