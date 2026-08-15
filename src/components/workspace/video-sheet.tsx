"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateVideoStage } from "@/app/workspace/actions-video";
import { ImageUploader } from "@/components/ui/image-uploader";

export function VideoSheet({ video, open, onOpenChange, workspaceId }: any) {
  if (!video) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-2 border-b">
          <SheetHeader>
            <SheetTitle className="text-xl">{video.title}</SheetTitle>
            <SheetDescription>
              Gérez les détails de cette vidéo. N'oubliez pas de valider chaque étape pour la faire avancer.
            </SheetDescription>
          </SheetHeader>
        </div>

        <Tabs defaultValue="idea" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-2 border-b">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="w-max h-9">
                <TabsTrigger value="idea">Idée</TabsTrigger>
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="voiceover">Voix off</TabsTrigger>
                <TabsTrigger value="editing">Montage</TabsTrigger>
                <TabsTrigger value="music">Musique</TabsTrigger>
                <TabsTrigger value="thumbnail">Miniature</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          <ScrollArea className="flex-1 p-6">
            <IdeaTab video={video} />
            <ScriptTab video={video} />
            {/* The rest of the tabs can be added similarly */}
            
            <VoiceoverTab video={video} />
            <EditingTab video={video} />
            <MusicTab video={video} />
            <ThumbnailTab video={video} />
            <SEOTab video={video} />
            <UploadTab video={video} />
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

// Composants pour chaque Tab
function IdeaTab({ video }: { video: any }) {
  const [description, setDescription] = useState(video.idea_description || "");
  const [notes, setNotes] = useState(video.idea_notes || "");
  const [validated, setValidated] = useState(video.idea_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      idea_description: description,
      idea_notes: notes,
      idea_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="idea" className="m-0 focus-visible:outline-none space-y-6">
      <div className="space-y-2">
        <Label htmlFor="idea-desc">Description de l'idée</Label>
        <Textarea 
          id="idea-desc" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'idée principale, l'angle, et le public cible..." 
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="idea-notes">Notes libres</Label>
        <Textarea 
          id="idea-notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ressources, liens, remarques..." 
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="idea-valid" 
            checked={validated}
            onCheckedChange={(c: boolean | string) => setValidated(!!c)}
          />
          <Label htmlFor="idea-valid" className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function ScriptTab({ video }: { video: any }) {
  const [content, setContent] = useState(video.script_content || "");
  const [notes, setNotes] = useState(video.script_notes || "");
  const [validated, setValidated] = useState(video.script_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const words = content.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  const chars = content.length;
  const estimatedMins = Math.max(1, Math.round(words / 150)); // ~150 words per minute

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      script_content: content,
      script_notes: notes,
      script_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="script" className="m-0 focus-visible:outline-none space-y-6">
      <div className="flex gap-4 mb-2 text-xs text-muted-foreground bg-muted p-2 rounded-md">
        <span>Mots : <strong className="text-foreground">{words}</strong></span>
        <span>Caractères : <strong className="text-foreground">{chars}</strong></span>
        <span>Durée est. : <strong className="text-foreground">~{estimatedMins} min</strong></span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="script-content">Contenu du script</Label>
        <Textarea 
          id="script-content" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre script ici..." 
          className="min-h-[250px] font-mono text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="script-notes">Notes</Label>
        <Textarea 
          id="script-notes" 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes pour la voix off ou le monteur..." 
          className="min-h-[80px]"
        />
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="script-valid" 
            checked={validated}
            onCheckedChange={(c: boolean | string) => setValidated(!!c)}
          />
          <Label htmlFor="script-valid" className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function VoiceoverTab({ video }: { video: any }) {
  const [type, setType] = useState(video.voiceover_type || "IA");
  const [settings, setSettings] = useState(video.voiceover_settings || "");
  const [narrator, setNarrator] = useState(video.voiceover_narrator || "");
  const [links, setLinks] = useState(video.voiceover_links || "");
  const [notes, setNotes] = useState(video.voiceover_notes || "");
  const [validated, setValidated] = useState(video.voiceover_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      voiceover_type: type,
      voiceover_settings: settings,
      voiceover_narrator: narrator,
      voiceover_links: links,
      voiceover_notes: notes,
      voiceover_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="voiceover" className="m-0 focus-visible:outline-none space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type de voix</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="IA">IA</option>
            <option value="Humain">Humain</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Nom du narrateur (ou voix IA)</Label>
          <Input 
            value={narrator}
            onChange={(e) => setNarrator(e.target.value)}
            placeholder="Ex: ElevenLabs - Antony" 
          />
        </div>
      </div>
      
      {type === "IA" && (
        <div className="space-y-2">
          <Label>Réglages IA</Label>
          <Input 
            value={settings}
            onChange={(e) => setSettings(e.target.value)}
            placeholder="Stabilité 75%, Clarté 80%..." 
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Liens (Fichiers audio générés)</Label>
        <Input 
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="Lien Google Drive, Dropbox..." 
        />
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Instructions pour la voix..." 
          className="min-h-[80px]"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function EditingTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.editing_notes || "");
  const [resources, setResources] = useState<string[]>(
    Array.isArray(video.editing_resources) ? video.editing_resources : []
  );
  const [validated, setValidated] = useState(video.editing_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      editing_notes: notes,
      editing_resources: resources,
      editing_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="editing" className="m-0 focus-visible:outline-none space-y-6">
      <div className="space-y-2">
        <Label>Ressources / Images de référence</Label>
        <ImageUploader 
          images={resources}
          onChange={setResources}
          maxImages={6}
          label="Ajouter des ressources de montage / références"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes pour le monteur</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Instructions de montage, rythme, style..." 
          className="min-h-[150px]"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function MusicTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.music_notes || "");
  const [validated, setValidated] = useState(video.music_validated || false);
  const [isSaving, setIsSaving] = useState(false);
  const [musics, setMusics] = useState(video.music_tracks || []);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      music_notes: notes,
      music_tracks: musics,
      music_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="music" className="m-0 focus-visible:outline-none space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Pistes Musicales</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => setMusics([...musics, { title: "", source: "", is_ia: false }])}>
            + Ajouter
          </Button>
        </div>
        
        {musics.map((music: any, i: number) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-muted/20 border rounded-md relative">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-1 h-6 w-6 p-0 text-destructive"
              onClick={() => {
                const newM = [...musics];
                newM.splice(i, 1);
                setMusics(newM);
              }}
            >
              x
            </Button>
            <Input 
              placeholder="Titre" 
              value={music.title} 
              onChange={(e) => {
                const newM = [...musics];
                newM[i].title = e.target.value;
                setMusics(newM);
              }} 
            />
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Source / Lien" 
                className="flex-1"
                value={music.source} 
                onChange={(e) => {
                  const newM = [...musics];
                  newM[i].source = e.target.value;
                  setMusics(newM);
                }} 
              />
              <div className="flex items-center gap-1 min-w-[70px]">
                <Checkbox 
                  checked={music.is_ia}
                  onCheckedChange={(c: boolean | string) => {
                    const newM = [...musics];
                    newM[i].is_ia = !!c;
                    setMusics(newM);
                  }}
                />
                <span className="text-xs">IA ?</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ambiance souhaitée..." 
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function ThumbnailTab({ video }: { video: any }) {
  const [notes, setNotes] = useState(video.thumbnail_notes || "");
  const [thumbnails, setThumbnails] = useState<string[]>(
    Array.isArray(video.thumbnail_images) ? video.thumbnail_images : []
  );
  const [validated, setValidated] = useState(video.thumbnail_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      thumbnail_notes: notes,
      thumbnail_images: thumbnails,
      thumbnail_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="thumbnail" className="m-0 focus-visible:outline-none space-y-6">
      <div className="space-y-2">
        <Label>Miniatures (1 à 3 propositions)</Label>
        <ImageUploader 
          images={thumbnails}
          onChange={setThumbnails}
          maxImages={3}
          label="Ajouter une miniature"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes pour le miniamaker</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texte, couleurs, éléments clés..." 
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function SEOTab({ video }: { video: any }) {
  const [title, setTitle] = useState(video.seo_title || "");
  const [desc, setDesc] = useState(video.seo_description || "");
  const [notes, setNotes] = useState(video.seo_notes || "");
  const [validated, setValidated] = useState(video.seo_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      seo_title: title,
      seo_description: desc,
      seo_notes: notes,
      seo_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="seo" className="m-0 focus-visible:outline-none space-y-6">
      <div className="space-y-2">
        <Label>Titre Principal</Label>
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Le titre YouTube optimal..." 
        />
      </div>
      
      <div className="space-y-2">
        <Label>Description YouTube</Label>
        <Textarea 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description, liens d'affiliation, sources..." 
          className="min-h-[150px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Notes / Tags</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tags, remarques..." 
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Étape Validée</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}

function UploadTab({ video }: { video: any }) {
  const [status, setStatus] = useState(video.upload_status || "Pas encore");
  const [url, setUrl] = useState(video.upload_url || "");
  const [notes, setNotes] = useState(video.upload_notes || "");
  const [validated, setValidated] = useState(video.upload_validated || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateVideoStage(video.id, {
      upload_status: status,
      upload_url: url,
      upload_notes: notes,
      upload_validated: validated
    });
    setIsSaving(false);
  };

  return (
    <TabsContent value="upload" className="m-0 focus-visible:outline-none space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Statut</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pas encore">Pas encore</option>
            <option value="Programmé">Programmé</option>
            <option value="Publié">Publié</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Lien de la vidéo</Label>
          <Input 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/..." 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Date programmée, remarques..." 
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox checked={validated} onCheckedChange={(c: boolean | string) => setValidated(!!c)} />
          <Label className="font-medium">Terminé (Upload Validé)</Label>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </TabsContent>
  );
}
