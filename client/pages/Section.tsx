import { useParams, useSearchParams, Link } from "react-router-dom";
import { useData } from "@/contexts/data";
import { useI18n } from "@/contexts/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import Gallery from "@/components/Gallery";
import { useSettings } from "@/contexts/settings";
import { Phone, Mail, Clock, MapPin, Share2, Megaphone, Info } from "lucide-react";

export default function SectionPage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useI18n();
  const { menu } = useData();
  const settings = useSettings();
  const [params] = useSearchParams();

  const section = menu.find((s: any) => String(s.id) === String(id));
  if (!section) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10 min-h-screen">
        <div className="text-center text-muted-foreground">
          {lang === "az" ? "Bölmə tapılmadı" : "Section not found"}
        </div>
      </main>
    );
  }

  const idStr = String(section.id);
  const titleAz = (section.title_az || "").toLowerCase().trim();
  const titleEn = (section.title_en || "").toLowerCase().trim();
  const isPR = idStr === "public-relations" || titleAz === "ictimaiyyətlə əlaqələr" || titleEn === "public relations";
  const isContact = idStr === "contact" || titleAz === "əlaqə məlumatları" || titleEn === "contact information";
  const isSpecial = isPR || isContact;

  const q = (params.get("q") ?? "").toLowerCase().trim();
  const filtered = section.articles.filter((a) => {
    if (!q) return true;
    const text =
      `${a.title.az} ${a.title.en} ${a.short_text.az} ${a.short_text.en} ${a.body.az} ${a.body.en}`.toLowerCase();
    return text.includes(q);
  });

  return (
    <main className="mx-auto max-w-7xl w-full px-4 md:px-6 pb-12 pt-6 md:pt-8 min-h-screen">
      <Breadcrumbs />
      {/* General / Special Content Block */}
      <section className="grid md:grid-cols-[2fr,1fr] gap-6 md:gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {section.general_info.title || (lang === "az" ? section.title_az : section.title_en)}
          </h2>
          <div className="mt-3 md:mt-4 text-muted-foreground text-base md:text-lg leading-relaxed space-y-4">
            {isPR ? (
              <>
                <p>
                  {lang === "az"
                    ? "Mətbuat və media sorğuları üçün aşağıdakı əlaqə vasitələrindən istifadə edin."
                    : "For press and media inquiries, please use the contact options below."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-blue-600" />Email</div>
                    <a href={`mailto:${settings.public_relations_details?.press_email ?? "press@minenergy.gov.az"}`} className="text-lg font-semibold">
                      {settings.public_relations_details?.press_email ?? "press@minenergy.gov.az"}
                    </a>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-blue-600" />{lang === "az" ? "Telefon" : "Phone"}</div>
                    <a href={`tel:${(settings.public_relations_details?.phone ?? "+994125001111").replace(/\s|-/g, "")}`} className="text-lg font-semibold">
                      {settings.public_relations_details?.phone ? settings.public_relations_details.phone.replace(/^\+?(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, "+$1 $2 $3 $4 $5") : "+994 12 500 11 11"}
                    </a>
                  </div>
                  <div className="rounded-xl border bg-card p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Megaphone className="h-4 w-4 text-blue-600" />{lang === "az" ? "Mətbuat qaydaları" : "Media guidelines"}</div>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-base">
                      {(settings.public_relations_details?.guidelines && settings.public_relations_details.guidelines.length > 0
                        ? settings.public_relations_details.guidelines.map((g, i) => (
                            <li key={i}>{lang === "az" ? g.az : g.en}</li>
                          ))
                        : [
                            lang === "az"
                              ? "Sorğulara 1 iş günü ərzində cavab verilir."
                              : "Requests are answered within 1 business day.",
                            lang === "az"
                              ? "Sorğularda mövzu, tarix və əlaqə məlumatlarını qeyd edin."
                              : "Include topic, date, and contact details in your request.",
                          ].map((t, i) => (
                            <li key={i}>{t}</li>
                          )))}
                    </ul>
                  </div>
                  <div className="rounded-xl border bg-card p-4 sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Share2 className="h-4 w-4 text-blue-600" />{lang === "az" ? "Sosial şəbəkələr" : "Social media"}</div>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {(settings.public_relations_details?.socials && settings.public_relations_details.socials.length > 0
                        ? settings.public_relations_details.socials
                        : [
                            { label: "Facebook", url: "https://facebook.com/minenergyaz" },
                            { label: "X/Twitter", url: "https://twitter.com/minenergyaz" },
                            { label: "YouTube", url: "https://youtube.com/@minenergyaz" },
                          ]
                      ).map((s, i) => (
                        <a key={i} className="underline" href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : isContact ? (
              <>
                <p>
                  {lang === "az"
                    ? "Nazirliklə əlaqə üçün aşağıdakı məlumatlardan istifadə edin."
                    : "Use the details below to contact the Ministry."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-blue-600" />{lang === "az" ? "Telefon" : "Phone"}</div>
                    <a href={`tel:${(settings.contact_details?.phone ?? "+994125001111").replace(/\s|-/g, "")}`} className="text-lg font-semibold">
                      {settings.contact_details?.phone ? settings.contact_details.phone.replace(/^\+?(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, "+$1 $2 $3 $4 $5") : "+994 12 500 11 11"}
                    </a>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-blue-600" />Email</div>
                    <a href={`mailto:${settings.contact_details?.email ?? "info@minenergy.gov.az"}`} className="text-lg font-semibold">
                      {settings.contact_details?.email ?? "info@minenergy.gov.az"}
                    </a>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-blue-600" />{lang === "az" ? "İş saatları" : "Working hours"}</div>
                    <div className="text-lg font-semibold">{lang === "az" ? (settings.contact_details?.hours_az ?? "B.e.–C.a. 09:00–18:00") : (settings.contact_details?.hours_en ?? "Mon–Fri 09:00–18:00")}</div>
                  </div>
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-blue-600" />{lang === "az" ? "Ünvan" : "Address"}</div>
                    <div className="text-lg font-semibold">{lang === "az" ? (settings.contact_details?.address_az ?? "Istiqlaliyyat 33, Bakı, Azərbaycan") : (settings.contact_details?.address_en ?? "33 Istiglaliyyat St, Baku, Azerbaijan")}</div>
                    <div className="mt-2">
                      <a className="underline" href={settings.contact_details?.map_url ?? "https://maps.google.com/?q=Istiqlaliyyat 33, Baku, Azerbaijan"} target="_blank" rel="noreferrer">
                        {lang === "az" ? "Xəritədə bax" : "View on map"}
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>
                {section.general_info.content ||
                  (lang === "az"
                    ? "Bu bölmədə Energetika Nazirliyinin fəaliyyəti ilə bağlı məlumatlar, rəqəmlər və əlaqədar materiallar təqdim olunur. Aşağıda son məqalələr ilə tanış ola bilərsiniz."
                    : "This section provides information related to the Ministry of Energy's activities, figures and related materials. Explore the latest articles below.")}
              </p>
            )}
          </div>
        </div>
        <div className="justify-self-end">
          {section.general_info.image && section.general_info.image !== "/placeholder.svg" && (
            <img
              src={section.general_info.image}
              alt=""
              className="w-full max-w-sm md:max-w-xs rounded-xl border"
            />
          )}
        </div>
      </section>

      {/* Children Sections List */}
      {Array.isArray((section as any)?.children) && (section as any).children.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold">
            {lang === "az" ? "Bölmələr" : "Sections"}
          </h3>
          <div className="mt-4 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(section as any).children.map((c: any) => (
              <Link
                key={c.id}
                to={`/section/${c.id}`}
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

      {/* Gallery Albums (only for non-special sections) */}
      {!isSpecial && Array.isArray((section as any).albums) && (section as any).albums.length > 0 && (
        <section className="mt-8 md:mt-12">
          <Gallery albums={(section as any).albums} />
        </section>
      )}

      {/* Pages List (only for non-special sections) */}
      {!isSpecial && section.pages && section.pages.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold">
            {lang === "az" ? "Bölmələr" : "Sections"}
          </h3>
          <div className="mt-4 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {section.pages.map((p) => (
              <Link
                key={p.id}
                to={`/section/${section.id}/page/${p.id}`}
                className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow block"
              >
                <div className="aspect-[16/9] w-full bg-muted/50">
                  <img
                    src={p.image || settings.placeholder || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <h4 className="mt-1 md:mt-2 text-lg md:text-xl font-semibold">
                    {lang === "az" ? p.title.az : p.title.en}
                  </h4>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">
                    {lang === "az" ? p.short_text.az : p.short_text.en}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles List (only for non-special sections) */}
      {!isSpecial && section.articles && section.articles.length > 0 && (
        <section className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold">
            {lang === "az" ? "Məqalələr" : "Articles"}
          </h3>
          <div className="mt-4 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.id}
                to={`/section/${section.id}/article/${a.id}`}
                className="rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow block"
              >
                <div className="aspect-[16/9] w-full bg-muted/50">
                  <img
                    src={a.image || settings.placeholder || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {a.date}
                  </div>
                  <h4 className="mt-1 md:mt-2 text-lg md:text-xl font-semibold">
                    {lang === "az" ? a.title.az : a.title.en}
                  </h4>
                  <p className="mt-2 text-sm md:text-base text-muted-foreground">
                    {lang === "az" ? a.short_text.az : a.short_text.en}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              {lang === "az" ? "Məlumat yoxdur" : "No items"}
            </div>
          )}
        </section>
      )}

    </main>
  );
}
