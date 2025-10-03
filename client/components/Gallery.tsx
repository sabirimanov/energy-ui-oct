import { useState } from "react";
import { MediaItem } from "@/data/boardData";
import { useI18n } from "@/contexts/i18n";
import { useSettings } from "@/contexts/settings";
import { Play, Image as ImageIcon } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import { Button } from "@/components/ui/button";

interface GalleryProps {
  albums: any[];
}

const getYouTubeThumbnail = (url: string) => {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

function toLocaleText(input: any): { az: string; en: string } | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return { az: input, en: input };
  if (typeof input === "object" && ("az" in input || "en" in input)) {
    return { az: input.az ?? "", en: input.en ?? "" };
  }
  return undefined;
}

function inferType(url: string | undefined, explicit?: string): "photo" | "video" {
  const t = explicit?.toLowerCase();
  if (t === "photo" || t === "image") return "photo";
  if (t === "video") return "video";
  if (!url) return "photo";
  return /youtu\.be|youtube\.com/.test(url) ? "video" : "photo";
}

function normalizeMedia(list: any[] | undefined): MediaItem[] {
  const arr = Array.isArray(list) ? list : [];
  return arr
    .map((m, i) => {
      const url: string = m.url ?? m.src ?? m.link ?? "";
      const type = inferType(url, m.type ?? m.kind);
      const thumbnail: string | undefined =
        m.thumbnail ?? m.thumb ?? m.preview ?? (type === "video" ? getYouTubeThumbnail(url) ?? undefined : undefined);
      const caption = toLocaleText(m.caption ?? { az: m.caption_az, en: m.caption_en });
      const id = m.id ?? i;
      if (!url) return null;
      return { id, type, url, thumbnail, caption } as MediaItem;
    })
    .filter(Boolean) as MediaItem[];
}

function albumTitle(album: any, lang: "az" | "en") {
  const t = toLocaleText(album.title ?? { az: album.title_az, en: album.title_en });
  return lang === "az" ? (t?.az ?? "") : (t?.en ?? "");
}
function albumDesc(album: any, lang: "az" | "en") {
  const d = toLocaleText(album.description ?? { az: album.description_az, en: album.description_en });
  return lang === "az" ? (d?.az ?? "") : (d?.en ?? "");
}
function albumDate(album: any) {
  return album.date ?? album.created_at ?? album.updated_at ?? "";
}
function albumThumb(album: any, settingsPlaceholder?: string | null) {
  const media = normalizeMedia(album.media ?? album.items ?? album.images ?? album.photos);
  return (
    album.thumbnail ??
    album.cover ??
    album.image ??
    (media[0] ? (media[0].type === "photo" ? media[0].url : media[0].thumbnail) : undefined) ??
    settingsPlaceholder ??
    "/placeholder.svg"
  );
}

export default function Gallery({ albums }: GalleryProps) {
  const { lang } = useI18n();
  const settings = useSettings();
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const openLightbox = (album: any, mediaIndex: number) => {
    setSelectedAlbum(album);
    setCurrentMediaIndex(mediaIndex);
    setLightboxOpen(true);
  };

  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
  };

  const goBackToAlbums = () => {
    setSelectedAlbum(null);
  };

  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        {/* Album header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBackToAlbums}
            className="text-primary hover:text-primary/80"
          >
            ← {lang === "az" ? "Albomlara qayıt" : "Back to albums"}
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">
            {albumTitle(selectedAlbum, lang)}
          </h2>
          <p className="text-muted-foreground text-lg">
            {albumDesc(selectedAlbum, lang)}
          </p>
          <p className="text-sm text-muted-foreground">{albumDate(selectedAlbum)}</p>
        </div>

        {/* Media grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {normalizeMedia(selectedAlbum.media ?? selectedAlbum.items ?? selectedAlbum.images ?? selectedAlbum.photos).map((media, index) => (
            <div
              key={media.id}
              className="group relative aspect-square bg-muted/40 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openLightbox(selectedAlbum, index)}
            >
              <img
                src={media.type === "photo" ? media.url : (media.thumbnail || getYouTubeThumbnail(media.url) || settings.placeholder || "/placeholder.svg") }
                alt={media.caption ? (lang === "az" ? media.caption.az : media.caption.en) : ""}
                className="w-full h-full object-cover"
              />

              {/* Media type indicator */}
              <div className="absolute top-2 right-2">
                {media.type === "video" ? (
                  <div className="bg-black/70 text-white p-2 rounded-full">
                    <Play className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="bg-black/70 text-white p-2 rounded-full">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {media.type === "video" ? (
                    <Play className="h-12 w-12 text-white" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              {/* Caption */}
              {media.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm line-clamp-2">
                    {lang === "az" ? media.caption.az : media.caption.en}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <Lightbox
            media={normalizeMedia(selectedAlbum.media ?? selectedAlbum.items ?? selectedAlbum.images ?? selectedAlbum.photos)}
            currentIndex={currentMediaIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
        )}
      </div>
    );
  }

  // Albums grid view
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground text-lg">
          {lang === "az" 
            ? "Nazirliyin fəaliyyəti və layihələri ilə bağlı foto və video materiallar" 
            : "Photo and video materials related to ministry activities and projects"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album: any) => (
          <div
            key={album.id}
            className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openAlbum(album)}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={albumThumb(album, settings.placeholder)}
                alt={albumTitle(album, lang)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Media count overlay */}
              <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {normalizeMedia(album.media ?? album.items ?? album.images ?? album.photos).length} {lang === "az" ? "media" : "items"}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            <div className="p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {albumTitle(album, lang)}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  {albumDesc(album, lang)}
                </p>
                <p className="text-sm text-muted-foreground">{albumDate(album)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {albums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {lang === "az" ? "Hələlik albüm yoxdur" : "No albums available yet"}
          </p>
        </div>
      )}
    </div>
  );
}
