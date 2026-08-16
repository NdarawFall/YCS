"use client";
import { useState } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, GripVertical, X, ZoomIn } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

// Sortable Item Component
function SortableThumbnail({ url, index, onRemove, onZoom }: { url: string, index: number, onRemove: () => void, onZoom: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-video rounded-xl overflow-hidden border border-border/80 bg-muted/40 shadow-sm group">
      <img src={url} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" />
      
      {/* Darkened Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button 
          type="button"
          onClick={onZoom}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          title="Voir en grand"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button 
          {...attributes} 
          {...listeners} 
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-grab active:cursor-grabbing transition-colors"
          title="Glisser pour réordonner"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <button 
          type="button" 
          onClick={onRemove} 
          className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
          title="Supprimer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Index badge */}
      <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm">
        {index + 1}
      </span>
    </div>
  );
}

export function ThumbnailPanel({ video, onSave, saving }: any) {
  const [thumbnails, setThumbnails] = useState<string[]>(
    Array.isArray(video.thumbnail_images) ? video.thumbnail_images : []
  );
  const [notes, setNotes] = useState(video.thumbnail_notes || "");
  const [validated, setValidated] = useState(video.thumbnail_validated || false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setThumbnails((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      thumbnail_images: thumbnails, 
      thumbnail_notes: notes, 
      thumbnail_validated: validated 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Propositions de miniature (Glissez pour réordonner)</Label>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={thumbnails} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {thumbnails.map((url, idx) => (
                <SortableThumbnail key={url} url={url} index={idx} onRemove={() => setThumbnails(thumbnails.filter((_, i) => i !== idx))} onZoom={() => setPreviewUrl(url)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {thumbnails.length < 3 && <ImageUploader images={thumbnails} onChange={setThumbnails} maxImages={3} label="Uploader vos miniatures" />}
      </div>
      
      {/* Lightbox Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Aperçu miniature" className="w-full h-auto rounded-2xl shadow-2xl border border-white/10" />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions pour le designer</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texte max 3 mots, couleurs vives..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="thumb-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="thumb-valid" className="text-sm font-semibold text-white cursor-pointer">
            Miniature validée — passer au SEO
          </Label>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
