import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSettings } from "@/contexts/settings";

export default function SubPage() {
  const { id, pageId } = useParams<{ id?: string; pageId?: string }>();
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();

  const section = id ? menu.find((s: any) => String(s.id) === String(id)) : undefined;

  const findPageRec = (list: any[] | undefined, pid?: string) => {
    if (!list || !pid) return undefined as any;
    for (const p of list) {
      if (String(p.id) === String(pid)) return p;
      const child = findPageRec((p as any)?.children as any[], pid);
      if (child) return child;
    }
    return undefined as any;
  };

  const findPageInMenu = (pid?: string) => {
    if (!pid) return undefined as any;
    for (const s of menu) {
      const found = findPageRec((s as any).pages as any[], pid);
      if (found) return { page: found, section: s } as any;
    }
    return undefined as any;
  };

  const result = section
    ? { page: findPageRec((section as any).pages as any[], pageId), section }
    : findPageInMenu(pageId);

  const page = result?.page;
  const parentSection = result?.section;

  if (!page) {
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

      {page.image && page.image !== "/placeholder.svg" && (
        <div className="mt-6 flex justify-center">
          <img
            src={page.image}
            alt=""
            className="rounded-2xl border max-w-md w-full object-cover"
          />
        </div>
      )}

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

      {Array.isArray((page as any)?.children) && (page as any).children.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold">
            {lang === "az" ? "Bölmələr" : "Sections"}
          </h3>
          <div className="mt-4 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(page as any).children.map((c: any) => (
              <Link
                key={c.id}
                to={`/page/${c.id}`}
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
