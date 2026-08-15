"use client";

import { useState } from "react";
import { deleteVideo } from "@/app/workspace/actions-video";
import { Trash2 } from "lucide-react";

export function DeleteVideoButton({ videoId, workspaceId }: { videoId: string; workspaceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Supprimer définitivement cette vidéo et toutes ses données ?")) return;
    setLoading(true);
    await deleteVideo(videoId, workspaceId);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
