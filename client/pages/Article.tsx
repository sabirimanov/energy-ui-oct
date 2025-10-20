import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";
import { useSettings } from "@/contexts/settings";

export default function ArticlePage() {
  const { id, articleId } = useParams<{ id: string; articleId: string }>();
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();
  const section = menu.find((s: any) => String(s.id) === String(id));
  const article = section?.articles.find(
    (a) => String(a.id) === String(articleId),
  );

  if (!section || !article) {
    return (
      <main className="mx-auto max-w-7xl w-full px-4 md:px-6 py-10 min-h-screen">
        <Breadcrumbs />
        <div className="text-muted-foreground">
          {lang === "az" ? "Məqalə tapılmadı" : "Article not found"}
        </div>
      </main>
    );
  }

  const idx = section.articles.findIndex(
    (a) => String(a.id) === String(articleId),
  );
  const alignRight = idx % 2 === 0;

  return (
    <main className="mx-auto max-w-7xl w-full px-4 md:px-6 pb-16 pt-6 md:pt-8 min-h-screen">
      <Breadcrumbs />
      <div className="mt-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          {lang === "az" ? article.title.az : article.title.en}
        </h1>
        <div className="text-base md:text-lg font-semibold whitespace-nowrap md:mt-1 px-4 py-1.5 rounded-full bg-accent text-foreground border shadow-sm">
          {article.date}
        </div>
      </div>
      {article.image && article.image !== "/placeholder.svg" && (
        <img
          src={article.image}
          alt=""
          className={cn(
            "mt-5 rounded-2xl border w-full md:w-96 object-cover",
            alignRight ? "md:float-right md:ml-8" : "md:float-left md:mr-8",
          )}
        />
      )}
      <div className="prose prose-slate max-w-none mt-6">
        {(() => {
          const html = lang === "az" ? article.body.az : article.body.en;
          const isHtml = /<\w+/.test(html);
          return isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p>{html}</p>
          );
        })()}
      </div>
      <div className="clear-both" />

      {Array.isArray((article as any)?.children) && (article as any).children.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold">
            {lang === "az" ? "Bölmələr" : "Sections"}
          </h3>
          <div className="mt-4 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(article as any).children.map((c: any) => (
              <Link
                key={c.id}
                to={`/section/${section.id}/page/${c.id}`}
                className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow block"
              >
                <div className="aspect-[16/9] w-full bg-muted/50">
                  {c.image && c.image !== "/placeholder.svg" ? (
                    <img src={c.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground">{lang === "az" ? (c.title_az ?? c.title?.az) : (c.title_en ?? c.title?.en)}</div>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h4 className="mt-1 md:mt-2 text-lg md:text-xl font-semibold">
                    {lang === "az" ? (c.title_az ?? c.title?.az) : (c.title_en ?? c.title?.en)}
                  </h4>
                  {c.short_text && (
                    <p className="mt-2 text-sm md:text-base text-muted-foreground">
                      {lang === "az" ? (c.short_text.az ?? c.short_text) : (c.short_text.en ?? c.short_text)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
