import { useSearchParams, Link } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import { useSettings } from "@/contexts/settings";
import Breadcrumbs from "@/components/Breadcrumbs";

// Helpers to normalize mixed API shapes (copied in spirit from Gallery)
function getYouTubeThumbnail(url: string) {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}
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
function normalizeMedia(list: any[] | undefined) {
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
      return { id, type, url, thumbnail, caption } as { id: string | number; type: "photo" | "video"; url: string; thumbnail?: string; caption?: { az: string; en: string } };
    })
    .filter(Boolean) as { id: string | number; type: "photo" | "video"; url: string; thumbnail?: string; caption?: { az: string; en: string } }[];
}

export default function SearchPage() {
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase().trim();

  const contains = (text: string | undefined) => (text ?? "").toLowerCase().includes(q);
  const containsLoc = (loc?: { az?: string; en?: string }) => contains(lang === "az" ? loc?.az : loc?.en) || contains(loc?.az) || contains(loc?.en);

  // Sections
  const sections = q
    ? menu
        .filter((s: any) => contains(s.title_az) || contains(s.title_en))
        .map((s: any) => ({
          key: `section-${s.id}`,
          to: `/section/${s.id}`,
          title: lang === "az" ? s.title_az : s.title_en,
          image: s.general_info?.image,
          description: undefined as string | undefined,
        }))
    : [];

  // Pages
  const pages = q
    ? menu.flatMap((s: any) =>
        (s.pages ?? [])
          .filter((p: any) =>
            containsLoc(p.title) || containsLoc(p.short_text) || containsLoc(p.body as any),
          )
          .map((p: any) => ({
            key: `page-${s.id}-${p.id}`,
            to: p.redirect_url ? String(p.redirect_url) : `/section/${s.id}/page/${p.id}`,
            title: lang === "az" ? p.title.az : p.title.en,
            image: p.image,
            description: lang === "az" ? p.short_text.az : p.short_text.en,
          })),
      )
    : [];

  // Articles
  const articles = q
    ? menu.flatMap((s: any) =>
        (s.articles ?? [])
          .filter((a: any) =>
            containsLoc(a.title) || containsLoc(a.short_text) || containsLoc(a.body as any),
          )
          .map((a: any) => ({
            key: `article-${s.id}-${a.id}`,
            to: `/section/${s.id}/article/${a.id}`,
            title: lang === "az" ? a.title.az : a.title.en,
            image: a.image,
            meta: a.date,
            description: lang === "az" ? a.short_text.az : a.short_text.en,
          })),
      )
    : [];

  // Albums
  const albums = q
    ? menu.flatMap((s: any) =>
        (s.albums ?? [])
          .filter((al: any) => containsLoc(al.title) || containsLoc(al.description))
          .map((al: any) => ({
            key: `album-${s.id}-${al.id}`,
            to: `/section/${s.id}`,
            title: lang === "az" ? (toLocaleText(al.title)?.az ?? "") : (toLocaleText(al.title)?.en ?? ""),
            image: al.thumbnail,
            description:
              lang === "az" ? (toLocaleText(al.description)?.az ?? "") : (toLocaleText(al.description)?.en ?? ""),
          })),
      )
    : [];

  // Media
  const media = q
    ? menu.flatMap((s: any) =>
        (s.albums ?? []).flatMap((al: any) =>
          normalizeMedia(al.media ?? al.items ?? al.images ?? al.photos)
            .filter((m) => containsLoc(m.caption))
            .map((m) => ({
              key: `media-${s.id}-${al.id}-${m.id}`,
              to: `/section/${s.id}`,
              title: m.caption ? (lang === "az" ? m.caption.az : m.caption.en) : (m.type === "video" ? (lang === "az" ? "Video" : "Video") : (lang === "az" ? "Şəkil" : "Photo")),
              image: m.type === "photo" ? m.url : (m.thumbnail || getYouTubeThumbnail(m.url) || undefined),
              description: (lang === "az" ? "Albom" : "Album") + (al.title ? `: ${lang === "az" ? (toLocaleText(al.title)?.az ?? "") : (toLocaleText(al.title)?.en ?? "")}` : ""),
            })),
        ),
      )
    : [];

  const hasAny = q && (sections.length + pages.length + articles.length + albums.length + media.length > 0);

  const renderGroup = (labelAz: string, labelEn: string, items: { key: string; to: string; title: string; image?: string; description?: string; meta?: string }[]) => {
    if (!items.length) return null;
    return (
      <section className="mt-4">
        <h3 className="text-xl md:text-2xl font-semibold">{lang === "az" ? labelAz : labelEn}</h3>
        <div className="mt-3 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Link key={it.key} to={it.to} className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow block">
              <div className="aspect-[16/9] w-full bg-muted/50">
                <img src={it.image || settings.placeholder || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 md:p-5">
                {it.meta && (
                  <div className="text-xs md:text-sm text-muted-foreground">{it.meta}</div>
                )}
                <h4 className="mt-1 md:mt-2 text-lg md:text-xl font-semibold">{it.title}</h4>
                {it.description && (
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">{it.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="mx-auto max-w-7xl w-full px-4 md:px-6 pb-12 pt-6 md:pt-8 min-h-screen">
      <Breadcrumbs />
      <h2 className="text-2xl md:text-3xl font-bold">
        {lang === "az" ? "Axtarış nəticələri" : "Search results"}
      </h2>

      {renderGroup("Bölmələr", "Sections", sections)}
      {renderGroup("Səhifələr", "Pages", pages)}
      {renderGroup("Məqalələr", "Articles", articles)}
      {renderGroup("Albomlar", "Albums", albums)}
      {renderGroup("Media", "Media", media)}

      {q && !hasAny && (
        <div className="text-muted-foreground mt-8">
          {lang === "az" ? "Heç bir nəticə tapılmadı" : "No results found"}
        </div>
      )}
      {!q && (
        <div className="text-muted-foreground mt-8">
          {lang === "az" ? "Axtarış üçün açar söz daxil edin" : "Enter a keyword to search"}
        </div>
      )}
    </main>
  );
}
