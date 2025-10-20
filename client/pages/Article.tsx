import { useParams } from "react-router-dom";
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
      <img
        src={article.image || settings.placeholder || "/placeholder.svg"}
        alt=""
        className={cn(
          "mt-5 rounded-2xl border w-full md:w-96 object-cover",
          alignRight ? "md:float-right md:ml-8" : "md:float-left md:mr-8",
        )}
      />
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
    </main>
  );
}
