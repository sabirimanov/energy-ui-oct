import type { Section } from "@/data/boardData";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import { useMemo } from "react";
import { useSettings } from "@/contexts/settings";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Building2,
  Newspaper,
  BarChart3,
  Leaf,
  Gauge,
  Globe2,
  Images,
  Users2,
  Phone,
} from "lucide-react";

const icons: Record<string, any> = {
  ministry: Building2,
  news: Newspaper,
  "energy-stats": BarChart3,
  renewables: Leaf,
  efficiency: Gauge,
  international: Globe2,
  gallery: Images,
  "public-relations": Users2,
  contact: Phone,
};

export default function Index() {
  const { lang } = useI18n();
  const settings = useSettings();
  const { menu } = useData();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const q = (params.get("q") ?? "").toLowerCase().trim();

  const sections = useMemo(() => {
    const list = menu;
    if (!q) return list;
    return list.filter((s: any) => {
      const t = `${s.title_az} ${s.title_en}`.toLowerCase();
      const inTitle = t.includes(q);
      const inArticles = s.articles.some((a) => {
        const text =
          `${a.title.az} ${a.title.en} ${a.short_text.az} ${a.short_text.en}`.toLowerCase();
        return text.includes(q);
      });
      return inTitle || inArticles;
    });
  }, [q, menu]);

  const firstRowCount = Math.ceil(sections.length / 2);
  const row1 = sections.slice(0, firstRowCount);
  const row2 = sections.slice(firstRowCount);

  return (
    <main
      className={cn(
        "mx-auto max-w-7xl w-full px-4 md:px-6 pb-12 pt-6 md:pt-8 min-h-screen bg-no-repeat bg-cover bg-center",
      )}
      style={{
        backgroundImage:
          'url("https://cdn.builder.io/api/v1/image/assets/306c8285e5754f408c22e409216c2b75/b4594338ee2442f681377cca2c75a826")',
        backgroundPosition: "center top",
      }}
    >
      <h1 className="sr-only">
        Azerbaijan Ministry of Energy Electronic Information Board
      </h1>
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-3 md:gap-5 justify-items-center">
          {row1.map((s) => {
            const Icon = icons[s.id];
            const title = lang === "az" ? s.title_az : s.title_en;
            let img = s.general_info.image || s.articles[0]?.image || "";
            if (!img || img === "/placeholder.svg") img = settings.placeholder || "/placeholder.svg";
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/section/${s.id}`)}
                className={cn(
                  "group relative rounded-2xl border bg-card p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-all h-full w-full flex flex-col",
                  "ring-1 ring-inset ring-border focus-visible:outline-none w-full h-auto min-h-[240px] overflow-hidden lg:col-span-2",
                )}
              >
                <div
                  className="rounded-xl border overflow-hidden flex-shrink-0"
                  style={{ borderColor: "hsl(217 80% 45%)" }}
                >
                  <div className="w-full h-[160px] bg-muted/40 grid place-items-center overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[hsl(217_80%_45%)]">
                        <Icon className="size-10 md:size-12 opacity-80" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-3 flex items-center justify-center">
                  <div className="text-base md:text-lg font-semibold tracking-tight min-h-[32px]">
                    {title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div
          className={cn(
            "w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-3 md:gap-5 justify-items-center",
            row2.length > 0 && row2.length < row1.length ? "lg:[&>*:first-child]:col-start-2" : undefined,
          )}
        >
          {row2.map((s) => {
            const Icon = icons[s.id];
            const title = lang === "az" ? s.title_az : s.title_en;
            let img = s.general_info.image || s.articles[0]?.image || "";
            if (!img || img === "/placeholder.svg") img = settings.placeholder || "/placeholder.svg";
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/section/${s.id}`)}
                className={cn(
                  "group relative rounded-2xl border bg-card p-4 md:p-5 text-center shadow-sm hover:shadow-md transition-all h-full w-full flex flex-col",
                  "ring-1 ring-inset ring-border focus-visible:outline-none w-full h-auto min-h-[240px] overflow-hidden lg:col-span-2",
                )}
              >
                <div
                  className="rounded-xl border overflow-hidden flex-shrink-0"
                  style={{ borderColor: "hsl(217 80% 45%)" }}
                >
                  <div className="w-full h-[160px] bg-muted/40 grid place-items-center overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[hsl(217_80%_45%)]">
                        <Icon className="size-10 md:size-12 opacity-80" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-3 flex items-center justify-center">
                  <div className="text-base md:text-lg font-semibold tracking-tight min-h-[32px]">
                    {title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {sections.length === 0 && (
        <div className="text-center text-muted-foreground mt-10">
          {lang === "az" ? "Nəticə tapılmadı" : "No results"}
        </div>
      )}
    </main>
  );
}
