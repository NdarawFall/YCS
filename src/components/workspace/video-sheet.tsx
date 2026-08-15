"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateVideoStage, deleteVideo, moveVideoToStage } from "@/app/workspace/actions-video";
import { ImageUploader } from "@/components/ui/image-uploader";
import { 
  Trash2, 
  Lightbulb, 
  FileText, 
  Mic, 
  Scissors, 
  Music, 
  Image as ImageIcon, 
  Search, 
  UploadCloud, 
  Save, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { STAGES, getActiveStage, getStageProgress } from "./kanban-board";

export function VideoSheet({ video, open, onOpenChange, workspaceId }: any) {
  const [activeTab, setActiveTab] = useState<string>("idea");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (video) {
      const current = getActiveStage(video);
      setActiveTab(current);
    }
  }, [video]);

  if (!video) return null;

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette vidéo ?")) return;
    setIsDeleting(true);
    await deleteVideo(video.id, workspaceId);
    setIsDeleting(false);
    onOpenChange(false);
  };

  const handleStageChange = async (targetStageId: string) => {
    await moveVideoToStage(video.id, targetStageId);
    setActiveTab(targetStageId);
  };

  const { percentage } = getStageProgress(video);
  const currentStage = getActiveStage(video);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl h-screen max-h-screen overflow-hidden flex flex-col p-0 bg-[#121217] border-l border-border/80 text-white shadow-2xl">
        
        {/* Sticky Top Header */}
        <div className="p-5 pb-4 border-b border-border/60 bg-[#17171e] shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF0000] text-white shadow-md shadow-red-600/25">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-current translate-x-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-lg font-bold text-white leading-tight truncate">
                  {video.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Progression : <strong className="text-red-400 font-mono">{percentage}%</strong> • Phase active : <strong className="text-white capitalize">{currentStage}</strong>
                </SheetDescription>
              </div>
            </div>

            {/* Quick Actions (Delete) */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 px-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg gap-1.5"
                title="Supprimer cette vidéo"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isDeleting ? "Suppression..." : "Supprimer"}</span>
              </Button>
            </div>
          </div>

          {/* Quick Stage Switcher Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-muted-foreground shrink-0 font-medium mr-1">Aller à :</span>
            {STAGES.map((stg) => {
              const isCurrent = currentStage === stg.id;
              const isSelectedTab = activeTab === stg.id;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(stg.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isSelectedTab
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-[#1f1f28] hover:bg-[#282834] text-muted-foreground hover:text-white"
                  }`}
                >
                  <span>{stg.num}. {stg.label}</span>
                  {video[stg.validateKey] && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs Body with Scroll Area & Fixed Bottom Bar */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Tabs Navigation */}
          <div className="px-5 py-2 border-b border-border/60 bg-[#14141a] shrink-0">
            <TabsList className="w-full justify-start h-9 bg-transparent p-0 gap-1 overflow-x-auto">
              {STAGES.map((stg) => (
                <TabsTrigger 
                  key={stg.id} 
                  value={stg.id}
                  className="rounded-lg text-xs font-semibold px-3 py-1.5 data-active:bg-red-600/20 data-active:text-red-400 data-active:border-red-600/40 border border-transparent"
                >
                  {stg.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content for each tab */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <IdeaTab video={video} />
            <ScriptTab video={video} />
            <VoiceoverTab video={video} />
            <EditingTab video={video} />
            <MusicTab video={video} />
            <ThumbnailTab video={video} />
            <SEOTab video={video} />
            <UploadTab video={video} />
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// -------------------------------------------------------------
// 1. Onglet Idée
// -------------------------------------------------------------
function IdeaTab({ video }: { video: any }) {
  const [description, setDescription] = useState(video.idea_description || "");
  const [notes, setNotes] = useState(video.idea_notes || "");
  const [validated, setValidated] = useState(video.idea_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      idea_description: description,
      idea_notes: notes,
      idea_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="idea" className="m-0 focus-visible:outline-none space-y-5">
      <div className="space-y-2">
        <Label htmlFor="idea-desc" className="text-sm font-bold text-white">Concept & Angle de la vidéo</Label>
        <Textarea 
          id="idea-desc" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'idée principale, l'accroche, la promesse et le public cible..." 
          className="min-h-[120px] bg-[#181822] border-border text-white rounded-xl focus-visible:ring-red-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idea-notes" className="text-sm font-bold text-white">Notes de recherche & Liens d'inspiration</Label>
        <Textarea 
          id="idea-notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Collez ici les liens des vidéos concurrentes, articles, idées de chapitres..." 
          className="min-h-[100px] bg-[#181822] border-border text-white rounded-xl focus-visible:ring-red-500"
        />
      </div>

      {/* Action Footer Always Accessible */}
      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="idea-valid" 
            checked={validated}
            onCheckedChange={(c: boolean | string) => setValidated(!!c)}
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="idea-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider l'Idée (Passer à l'étape suivante)
          </Label>
        </div>
        
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 2. Onglet Script
// -------------------------------------------------------------
function ScriptTab({ video }: { video: any }) {
  const [content, setContent] = useState(video.script_content || "");
  const [notes, setNotes] = useState(video.script_notes || "");
  const [validated, setValidated] = useState(video.script_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const words = content.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  const chars = content.length;
  const estimatedMins = Math.max(1, Math.round(words / 150));

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      script_content: content,
      script_notes: notes,
      script_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="script" className="m-0 focus-visible:outline-none space-y-5">
      <div className="grid grid-cols-3 gap-3 p-3 bg-[#181822] border border-border/70 rounded-xl text-center">
        <div>
          <div className="text-xs text-muted-foreground">Mots</div>
          <div className="text-base font-bold text-white">{words}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Caractères</div>
          <div className="text-base font-bold text-white">{chars}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Durée estimée</div>
          <div className="text-base font-bold text-red-400">~{estimatedMins} min</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="script-content" className="text-sm font-bold text-white">Texte du script</Label>
        <Textarea 
          id="script-content" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez ou collez votre script complet ici..." 
          className="min-h-[220px] font-mono text-sm bg-[#181822] border-border text-white rounded-xl focus-visible:ring-red-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="script-notes" className="text-sm font-bold text-white">Instructions pour la voix off & montage</Label>
        <Textarea 
          id="script-notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: ton énergique, faire des pauses à 02:30, insérer un b-roll..." 
          className="min-h-[80px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="script-valid" 
            checked={validated}
            onCheckedChange={(c: boolean | string) => setValidated(!!c)}
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="script-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider le Script
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 3. Onglet Voix Off
// -------------------------------------------------------------
function VoiceoverTab({ video }: { video: any }) {
  const [type, setType] = useState(video.voiceover_type || "IA");
  const [settings, setSettings] = useState(video.voiceover_settings || "");
  const [narrator, setNarrator] = useState(video.voiceover_narrator || "");
  const [links, setLinks] = useState(video.voiceover_links || "");
  const [notes, setNotes] = useState(video.voiceover_notes || "");
  const [validated, setValidated] = useState(video.voiceover_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      voiceover_type: type,
      voiceover_settings: settings,
      voiceover_narrator: narrator,
      voiceover_links: links,
      voiceover_notes: notes,
      voiceover_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="voiceover" className="m-0 focus-visible:outline-none space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Génération</Label>
          <select 
            className="flex h-11 w-full rounded-xl border border-border bg-[#181822] px-3 text-sm text-white focus:ring-red-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="IA">Voix IA (ElevenLabs, etc.)</option>
            <option value="Humain">Acteur Humain / Micro</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Narrateur / Voix utilisée</Label>
          <Input 
            value={narrator}
            onChange={(e) => setNarrator(e.target.value)}
            placeholder="Ex: ElevenLabs 'Antony' (Stabilité 75%)" 
            className="h-11 bg-[#181822] border-border text-white rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Lien de l'audio généré</Label>
        <Input 
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="Lien Google Drive, Dropbox ou direct..." 
          className="h-11 bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Notes pour la voix</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Remarques sur la prononciation, le rythme..." 
          className="min-h-[100px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="vo-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="vo-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider la Voix Off
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 4. Onglet Montage
// -------------------------------------------------------------
function EditingTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.editing_notes || "");
  const [resources, setResources] = useState<string[]>(
    Array.isArray(video.editing_resources) ? video.editing_resources : []
  );
  const [validated, setValidated] = useState(video.editing_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      editing_notes: notes,
      editing_resources: resources,
      editing_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="editing" className="m-0 focus-visible:outline-none space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Ressources Visuelles & Références (Cloudinary HD)</Label>
        <ImageUploader 
          images={resources}
          onChange={setResources}
          maxImages={6}
          label="Glissez des images de référence ou assets"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions pour le monteur</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Style de transitions, sous-titres, graphiques à insérer..." 
          className="min-h-[120px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="edit-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="edit-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider le Montage
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 5. Onglet Musique
// -------------------------------------------------------------
function MusicTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.music_notes || "");
  const [validated, setValidated] = useState(video.music_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [musics, setMusics] = useState(video.music_tracks || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      music_notes: notes,
      music_tracks: musics,
      music_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="music" className="m-0 focus-visible:outline-none space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-white">Pistes Audio / Musiques de fond</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setMusics([...musics, { title: "", source: "", is_ia: false }])}
            className="rounded-xl border-border/80 text-xs"
          >
            + Ajouter une piste
          </Button>
        </div>
        
        {musics.map((music: any, i: number) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-[#181822] border border-border/70 rounded-xl relative">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="absolute top-1.5 right-1.5 h-6 w-6 p-0 text-red-400 hover:bg-red-500/10"
              onClick={() => {
                const newM = [...musics];
                newM.splice(i, 1);
                setMusics(newM);
              }}
            >
              x
            </Button>
            <Input 
              placeholder="Titre de la musique..." 
              value={music.title} 
              onChange={(e) => {
                const newM = [...musics];
                newM[i].title = e.target.value;
                setMusics(newM);
              }} 
              className="h-10 bg-[#121217] border-border text-white rounded-lg"
            />
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Lien Epidemic Sound, Artlist, YouTube Audio..." 
                className="flex-1 h-10 bg-[#121217] border-border text-white rounded-lg"
                value={music.source} 
                onChange={(e) => {
                  const newM = [...musics];
                  newM[i].source = e.target.value;
                  setMusics(newM);
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Ambiance sonore souhaitée</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Rythme dynamique au début, calme au milieu, épique à la fin..." 
          className="min-h-[100px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="music-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="music-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider la Musique
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 6. Onglet Miniature
// -------------------------------------------------------------
function ThumbnailTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.thumbnail_notes || "");
  const [thumbnails, setThumbnails] = useState<string[]>(
    Array.isArray(video.thumbnail_images) ? video.thumbnail_images : []
  );
  const [validated, setValidated] = useState(video.thumbnail_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      thumbnail_notes: notes,
      thumbnail_images: thumbnails,
      thumbnail_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="thumbnail" className="m-0 focus-visible:outline-none space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Miniatures (1 à 3 propositions pour A/B Test)</Label>
        <ImageUploader 
          images={thumbnails}
          onChange={setThumbnails}
          maxImages={3}
          label="Uploader les propositions de miniature"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions pour le miniamaker</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texte de la miniature (max 3 mots), couleurs vives, visage expressif..." 
          className="min-h-[100px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="thumb-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="thumb-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider la Miniature
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 7. Onglet SEO
// -------------------------------------------------------------
function SEOTab({ video }: { video: any }) {
  const [title, setTitle] = useState(video.seo_title || "");
  const [desc, setDesc] = useState(video.seo_description || "");
  const [notes, setNotes] = useState(video.seo_notes || "");
  const [validated, setValidated] = useState(video.seo_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      seo_title: title,
      seo_description: desc,
      seo_notes: notes,
      seo_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="seo" className="m-0 focus-visible:outline-none space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Titre YouTube Définitif (Optimisé CTR)</Label>
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: 5 Habitudes qui m'ont rendu millionnaire à 25 ans" 
          className="h-11 bg-[#181822] border-border text-white rounded-xl"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Description & Liens YouTube</Label>
        <Textarea 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description de la vidéo, liens d'affiliation, chapitres, sources..." 
          className="min-h-[140px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Tags & Mots-clés SEO</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="finance, investissement, argent, business..." 
          className="min-h-[80px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="seo-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="seo-valid" className="font-bold text-sm text-white cursor-pointer">
            Valider le SEO
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}

// -------------------------------------------------------------
// 8. Onglet Upload
// -------------------------------------------------------------
function UploadTab({ video }: { video: any }) {
  const [status, setStatus] = useState(video.upload_status || "Pas encore");
  const [url, setUrl] = useState(video.upload_url || "");
  const [notes, setNotes] = useState(video.upload_notes || "");
  const [validated, setValidated] = useState(video.upload_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    await updateVideoStage(video.id, {
      upload_status: status,
      upload_url: url,
      upload_notes: notes,
      upload_validated: validated
    });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <TabsContent value="upload" className="m-0 focus-visible:outline-none space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Statut YouTube Studio</Label>
          <select 
            className="flex h-11 w-full rounded-xl border border-border bg-[#181822] px-3 text-sm text-white focus:ring-red-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pas encore">En cours de production</option>
            <option value="Programmé">Programmé sur YouTube</option>
            <option value="Publié">Publié en ligne</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Lien de la vidéo finale</Label>
          <Input 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/..." 
            className="h-11 bg-[#181822] border-border text-white rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Notes de publication</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Date & heure programmée, premier commentaire à épingler..." 
          className="min-h-[120px] bg-[#181822] border-border text-white rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#181822] border border-border/70 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <Checkbox 
            id="up-valid"
            checked={validated} 
            onCheckedChange={(c: boolean | string) => setValidated(!!c)} 
            className="data-checked:bg-red-600 data-checked:border-red-600"
          />
          <Label htmlFor="up-valid" className="font-bold text-sm text-white cursor-pointer">
            Vidéo Terminée & Prête
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Enregistré !</span>}
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-md shadow-red-600/20">
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
