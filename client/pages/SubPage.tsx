import { useParams } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSettings } from "@/contexts/settings";

export default function SubPage() {
  const { id, pageId } = useParams<{ id: string; pageId: string }>();
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();

  const section = menu.find((s: any) => String(s.id) === String(id));
  const page = section?.pages?.find((p) => String(p.id) === String(pageId));

  if (!section || !page) {
    return (
      <main className="mx-auto max-w-7xl w-full px-4 md:px-6 py-10 min-h-screen">
        <Breadcrumbs />
        <div className="text-center text-muted-foreground">
          {lang === "az" ? "Səhifə tapılmadı" : "Page not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl w-full px-4 md:px-6 pb-16 pt-6 md:pt-8 min-h-screen">
      <Breadcrumbs />
      
      <div className="mt-1">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          {lang === "az" ? page.title.az : page.title.en}
        </h1>
      </div>

      <div className="mt-6 flex justify-center">
        <img
          src={page.image || settings.placeholder || "/placeholder.svg"}
          alt=""
          className="rounded-2xl border max-w-md w-full object-cover"
        />
      </div>

      <div className="prose prose-slate max-w-none mt-6">
        {(() => {
          const html = lang === "az" ? page.body.az : page.body.en;
          const isHtml = /<\w+/.test(html);
          return isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p>{html}</p>
          );
        })()}
      </div>
    </main>
  );
}
