import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem } from "@/data/boardData";
import { useI18n } from "@/contexts/i18n";

interface LightboxProps {
  media: MediaItem[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

export default function Lightbox({ media, currentIndex, open, onOpenChange }: LightboxProps) {
  const { lang } = useI18n();
  const [index, setIndex] = useState(currentIndex);
  const currentMedia = media[index];

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const goToPrevious = () => {
    setIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onOpenChange(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!currentMedia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-0">
        <DialogTitle className="sr-only">
          {currentMedia.caption ? (lang === "az" ? currentMedia.caption.az : currentMedia.caption.en) : "Media"}
        </DialogTitle>
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation buttons */}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Media content */}
        <div className="flex items-center justify-center w-full h-full p-8">
          {currentMedia.type === "photo" ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.caption ? (lang === "az" ? currentMedia.caption.az : currentMedia.caption.en) : ""}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full max-w-6xl max-h-[80vh] aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(currentMedia.url)}
                title={currentMedia.caption ? (lang === "az" ? currentMedia.caption.az : currentMedia.caption.en) : "Video"}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Caption */}
        {currentMedia.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <p className="text-lg font-medium text-center">
              {lang === "az" ? currentMedia.caption.az : currentMedia.caption.en}
            </p>
            {media.length > 1 && (
              <p className="text-sm text-white/70 text-center mt-2">
                {index + 1} / {media.length}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
