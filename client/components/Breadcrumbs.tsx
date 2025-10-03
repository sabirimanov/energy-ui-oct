import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { useData } from "@/contexts/data";

export default function Breadcrumbs() {
  const { lang } = useI18n();
  const { menu } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, articleId, pageId } = useParams();

  const isHome = location.pathname === "/";
  const sectionTitleMap: Record<string, string> = {
    ministry: lang === "az" ? "Nazirlik" : "Ministry",
    news: lang === "az" ? "Xəbərlər və Elanlar" : "News & Announcements",
    "energy-stats": lang === "az" ? "Enerji Statistikası" : "Energy Statistics",
    renewables: lang === "az" ? "Bərpa Olunan Enerji" : "Renewable Energy",
    efficiency: lang === "az" ? "Enerji Səmərəliliyi" : "Energy Efficiency",
    international:
      lang === "az" ? "Beynəlxalq Əməkdaşlıq" : "International Cooperation",
    gallery: lang === "az" ? "Video və Foto Qalereya" : "Video & Photo Gallery",
    "public-relations":
      lang === "az" ? "İctimaiyyətlə Əlaqələr" : "Public Relations",
    contact: lang === "az" ? "Əlaqə Məlumatları" : "Contact Information",
  } as const;

  // Get current section, article, or page details
  const section = id ? menu.find((s: any) => String(s.id) === String(id)) : null;
  const article = section && articleId ? section.articles.find((a) => String(a.id) === String(articleId)) : null;
  const page = section && pageId ? section.pages?.find((p) => String(p.id) === String(pageId)) : null;

  const sectionTitle = section ? (lang === "az" ? (section as any).title_az : (section as any).title_en) : (sectionTitleMap[id ?? ""] ?? "");
  const articleTitle = article ? (lang === "az" ? article.title.az : article.title.en) : "";
  const pageTitle = page ? (lang === "az" ? page.title.az : page.title.en) : "";

  const fallback = (articleId || pageId) ? `/section/${id}` : "/";
  const handleBack = () => {
    const sameOriginReferrer = !!document.referrer && document.referrer.startsWith(window.location.origin);
    if (window.history.length > 1 && sameOriginReferrer) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <div className="flex items-center justify-between mb-3 md:mb-4">
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 rounded-xl bg-muted text-foreground px-4 py-2 md:px-5 md:py-3 text-sm md:text-base hover:bg-muted/80"
      >
        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        {lang === "az" ? "Geri" : "Back"}
      </button>
      <nav aria-label="Breadcrumb" className="ml-auto">
        <ol className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-foreground">
              {lang === "az" ? "Ana səhifə" : "Home"}
            </Link>
          </li>
          {!isHome && sectionTitle && (
            <>
              <li>
                <ChevronRight className="size-4" />
              </li>
              <li>
                {(articleId || pageId) ? (
                  <Link to={`/section/${id}`} className="hover:text-foreground">
                    {sectionTitle}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{sectionTitle}</span>
                )}
              </li>
            </>
          )}
          {(articleTitle || pageTitle) && (
            <>
              <li>
                <ChevronRight className="size-4" />
              </li>
              <li className="text-foreground font-medium">
                {articleTitle || pageTitle}
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}
