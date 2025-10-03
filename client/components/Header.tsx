import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Facebook, Globe, Instagram, Linkedin, Menu, Send, Twitter, X, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSettings } from "@/contexts/settings";
import { useData } from "@/contexts/data";

export default function Header() {
  const { lang, setLang } = useI18n();
  const settings = useSettings();
  const { menu } = useData();
  const [now, setNow] = useState(new Date());
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const dateParts = useMemo(() => {
    const d = now;
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    if (lang === "az") {
      const months = [
        "yanvar",
        "fevral",
        "mart",
        "aprel",
        "may",
        "iyun",
        "iyul",
        "avqust",
        "sentyabr",
        "oktyabr",
        "noyabr",
        "dekabr",
      ] as const;
      return { date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`, time: `${h}:${m}:${s}` };
    }
    try {
      const date = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
      const time = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(d);
      return { date, time };
    } catch {
      return { date: now.toLocaleDateString(), time: now.toLocaleTimeString() };
    }
  }, [now, lang]);

  const resolveSocialIcon = (label: string): LucideIcon => {
    const normalized = label.trim().toLowerCase();
    if (normalized.includes("facebook")) return Facebook;
    if (normalized.includes("instagram")) return Instagram;
    if (normalized.includes("youtube")) return Youtube;
    if (normalized.includes("linkedin")) return Linkedin;
    if (normalized.includes("twitter") || normalized === "x" || normalized.startsWith("x/")) return Twitter;
    if (normalized.includes("telegram")) return Send;
    return Globe;
  };

  const socialLinks = useMemo(() => {
    const provided = settings.public_relations_details?.socials?.filter(
      (item): item is { label: string; url: string } => Boolean(item?.label && item?.url)
    );
    const fallback = [
      { label: "Facebook", url: "https://facebook.com/minenergyaz" },
      { label: "X/Twitter", url: "https://twitter.com/minenergyaz" },
      { label: "YouTube", url: "https://youtube.com/@minenergyaz" },
    ];
    return provided && provided.length > 0 ? provided : fallback;
  }, [settings.public_relations_details?.socials]);

  const callCenterWidthClasses = "w-20 sm:w-24 md:w-28";

  const q = params.get("q") ?? "";

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 py-3 md:py-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
        <div className="col-span-1 flex items-center gap-3 md:gap-4">
          <a href="https://minenergy.gov.az/" aria-label="Energetika Nazirliyinin rəsmi saytı" className="block">
            <img
              src={(lang === "az" ? settings.logo.az : settings.logo.en) || "https://cdn.builder.io/api/v1/image/assets%2F580773eac62d413f979e27499c2b5554%2F6377430ab15146f4800001679726eb9f?format=webp&width=800"}
              alt="Azerbaijan Ministry of Energy"
              className="h-16 md:h-24 lg:h-28 xl:h-32 w-auto object-contain"
            />
          </a>
        </div>

        <div className="col-span-1 md:col-span-2 order-3 md:order-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <Input
              placeholder={lang === "az" ? "Axtarış..." : "Search..."}
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                const next = new URLSearchParams(params);
                if (v) next.set("q", v);
                else next.delete("q");
                setParams(next, { replace: true });
                if (v) {
                  if (location.pathname !== "/search")
                    navigate("/search", { replace: false });
                } else {
                  if (location.pathname !== "/")
                    navigate("/", { replace: false });
                }
              }}
              className="h-11 md:h-12 rounded-xl text-sm md:text-base w-48 sm:w-56 md:w-64 lg:w-72"
            />
            <div className="flex items-center gap-2 sm:gap-2.5">
              {socialLinks.map((social, index) => {
                const Icon = resolveSocialIcon(social.label);
                return (
                  <a
                    key={`${social.label}-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-white/80 text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button className={`h-12 ${callCenterWidthClasses} rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90`}>
                974
              </Button>
              <span className={`block text-[10px] md:text-[11px] font-semibold text-muted-foreground text-center uppercase tracking-[0.08em] ${callCenterWidthClasses}`}>
                {lang === "az" ? "Çağrı Mərkəzi" : "Call Center"}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 order-2 md:order-3 flex items-center justify-end gap-3 md:gap-4">
          <div className="text-right text-xs md:text-sm leading-tight text-muted-foreground w-[200px] md:w-[240px]">
            <div className="font-medium text-foreground">
              <div>{dateParts.date}</div>
              <div>{dateParts.time}</div>
            </div>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <button
              aria-label="Azerbaijani"
              onClick={() => setLang("az")}
              className={`px-3 md:px-4 py-2 rounded-md text-sm md:text-base font-semibold ${lang === "az" ? "bg-background text-foreground shadow" : "text-foreground/70"}`}
            >
              AZ
            </button>
            <button
              aria-label="English"
              onClick={() => setLang("en")}
              className={`px-3 md:px-4 py-2 rounded-md text-sm md:text-base font-semibold ${lang === "en" ? "bg-background text-foreground shadow" : "text-foreground/70"}`}
            >
              EN
            </button>
          </div>
          {!isHome && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 md:h-12 md:w-12 [&_svg]:!size-6">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[24rem] sm:w-[30rem] [&>button.absolute.right-4.top-4:not(.custom-close)]:hidden">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="custom-close absolute right-4 top-4 rounded-2xl h-12 w-12 md:h-14 md:w-14 [&_svg]:!size-6">
                    <X />
                  </Button>
                </SheetClose>
                <SheetHeader>
                  <SheetTitle className="pt-2.5 md:pt-4 text-2xl md:text-3xl">{lang === "az" ? "Bölmələr" : "Sections"}</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 grid gap-3">
                  {menu.map((s) => (
                    <SheetClose asChild key={s.id}>
                      <Link
                        to={`/section/${s.id}`}
                        className="px-4 md:px-5 py-3 md:py-4 rounded-xl hover:bg-muted text-foreground text-lg md:text-xl"
                      >
                        {lang === "az" ? s.title_az : s.title_en}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
