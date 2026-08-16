import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Film, Users, User, Trash2, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
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
                className="group flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-6 glass border-border/10 hover:border-red-600/50 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/5"
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-full md:w-64 aspect-video rounded-2xl overflow-hidden flex items-center justify-center bg-[#0f0f13] border border-border/50">
                    {video.thumbnail_images && Array.isArray(video.thumbnail_images) && video.thumbnail_images.length > 0 ? (
                      <img src={video.thumbnail_images[0]} alt="Miniature" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isComplete ? "text-emerald-500/50" : "text-red-500/30"}`}>
                        <Film className="h-16 w-16" />
                      </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="font-extrabold text-white text-lg truncate group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {video.is_team_mode ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <Users className="h-3.5 w-3.5" /> Équipe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                          <User className="h-3.5 w-3.5" /> Solo
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {timeAgo(video.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-red-600 to-red-400"}`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-white font-mono">{pct}%</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground font-medium">
                    {isComplete ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Publiée</span>
                    ) : (
                      `Étape actuelle : ${currentStage} (${stageDone}/${total})`
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
