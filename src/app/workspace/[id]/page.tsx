import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Film, Users, User, Trash2, Clock, ArrowRight } from "lucide-react";
import { CreateVideoDialog } from "@/components/workspace/create-video-dialog";

const STAGES = [
  { key: "idea_validated", label: "Idée" },
  { key: "script_validated", label: "Script" },
  { key: "voiceover_validated", label: "Voix Off" },
  { key: "editing_validated", label: "Montage" },
  { key: "music_validated", label: "Musique" },
  { key: "thumbnail_validated", label: "Miniature" },
  { key: "seo_validated", label: "SEO" },
  { key: "upload_validated", label: "Publication" },
] as const;

function getProgress(video: Record<string, boolean | unknown>) {
  const done = STAGES.filter((s) => video[s.key]).length;
  return { done, total: STAGES.length, pct: Math.round((done / STAGES.length) * 100) };
}

function getCurrentStageLabel(video: Record<string, boolean | unknown>) {
  for (const stage of STAGES) {
    if (!video[stage.key]) return stage.label;
  }
  return "Terminée";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return "Hier";
  return `Il y a ${d} jours`;
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: videos } = await supabase
    .from("videos")
    .select("id, title, updated_at, upload_validated, is_team_mode, idea_validated, script_validated, voiceover_validated, editing_validated, music_validated, thumbnail_validated, seo_validated, thumbnail_images")
    .eq("workspace_id", id)
    .order("updated_at", { ascending: false });

  const list = (videos || []) as Record<string, boolean | unknown>[];

  const done = list.filter((v) => (v as any).upload_validated).length;
  const inProgress = list.length - done;

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
        <span className="text-muted-foreground">
          <span className="text-white font-bold text-base sm:text-lg">{list.length}</span> vidéo{list.length !== 1 ? "s" : ""}
        </span>
        <span className="text-muted-foreground">
          <span className="text-amber-400 font-bold">{inProgress}</span> en production
        </span>
        <span className="text-muted-foreground">
          <span className="text-emerald-400 font-bold">{done}</span> publiées
        </span>
      </div>

      {list.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 glass rounded-3xl border border-dashed border-red-500/30">
          <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5 ring-1 ring-red-500/20 shadow-lg shadow-red-600/10">
            <Film className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Aucune vidéo en production</h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm">
            Créez votre première vidéo pour démarrer le pipeline de production.
          </p>
          <CreateVideoDialog workspaceId={id} />
        </div>
      ) : (
        /* Video List */
        <div className="grid grid-cols-1 gap-4">
          {list.map((video: any) => {
            const { done: stageDone, total, pct } = getProgress(video);
            const currentStage = getCurrentStageLabel(video);
            const isComplete = video.upload_validated;

            return (
              <Link
                key={video.id}
                href={`/workspace/${id}/video/${video.id}`}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 sm:p-5 glass border-border/10 hover:border-red-600/50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-1"
              >
                {/* Header row on mobile / Left on desktop */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail placeholder or icon */}
                  <div className={`shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center font-black text-lg sm:text-xl border ${isComplete ? "border-emerald-500/30" : "border-red-600/20"}`}>
                    {video.thumbnail_images && Array.isArray(video.thumbnail_images) && video.thumbnail_images.length > 0 ? (
                      <img src={video.thumbnail_images[0]} alt="Miniature" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isComplete ? "bg-emerald-500/10 text-emerald-400" : "bg-red-600/10 text-red-500"}`}>
                        {isComplete ? "✓" : <Film className="h-5 w-5 sm:h-8 sm:w-8" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h3>
                      {video.is_team_mode ? (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <Users className="h-2.5 w-2.5" /> Équipe
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground">
                          <User className="h-2.5 w-2.5" /> Solo
                        </span>
                      )}
                    </div>

                    <div className="sm:hidden text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(video.updated_at)}
                    </div>
                  </div>

                  <ArrowRight className="sm:hidden h-5 w-5 text-muted-foreground shrink-0 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Center: Title + progress */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-red-600 to-red-400"}`}
                        style={{ width: `${Math.max(3, pct)}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>

                  {/* Stage pills (Desktop full pills, Mobile clean badge) */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <div className="hidden sm:flex items-center gap-1">
                      {STAGES.map((s) => (
                        <div
                          key={s.key}
                          className={`h-1.5 w-5 rounded-full transition-colors ${video[s.key] ? "bg-emerald-500" : "bg-white/10"}`}
                          title={s.label}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:ml-2 text-muted-foreground font-medium">
                      {isComplete ? "✓ Terminée" : `Étape : ${currentStage} (${stageDone}/${total})`}
                    </span>
                  </div>
                </div>

                {/* Right: Date + arrow (Desktop only) */}
                <div className="hidden sm:flex shrink-0 flex-col items-end gap-3 text-right">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(video.updated_at)}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
