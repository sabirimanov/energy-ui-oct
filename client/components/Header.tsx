import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Facebook, Globe, Instagram, Linkedin, Menu, Search, Send, X, Youtube } from "lucide-react";
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

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(params.get("q") ?? "");

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setSearchText(params.get("q") ?? "");
  }, [params]);

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
      const time = `${h}:${m}:${s}`;
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
    if (normalized.includes("twitter") || normalized === "x" || normalized.startsWith("x/")) return X;
    if (normalized.includes("telegram")) return Send;
    return Globe;
  };

  const socialLinks = useMemo(() => {
    const provided = settings.public_relations_details?.socials?.filter(
      (item): item is { label: string; url: string } => Boolean(item?.label && item?.url)
    ) || [];

    const fallback = [
      { label: "Facebook", url: "https://facebook.com/minenergyaz" },
      { label: "Instagram", url: "https://instagram.com/minenergyaz" },
      { label: "X", url: "https://x.com/minenergyaz" },
      { label: "YouTube", url: "https://youtube.com/@minenergyaz" },
    ];

    const desiredOrder = ["facebook", "instagram", "x", "twitter", "youtube"];
    const all = [...provided, ...fallback];
    const uniqueByHost: { [k: string]: { label: string; url: string } } = {};
    for (const item of all) {
      const n = item.label.toLowerCase();
      const key = desiredOrder.find((k) => n.includes(k)) ?? n;
      if (!uniqueByHost[key]) uniqueByHost[key] = item;
    }
    const ordered: { label: string; url: string }[] = [];
    for (const key of ["facebook", "instagram", "x", "youtube"]) {
      const k = key === "x" ? (uniqueByHost["x"] ? "x" : "twitter") : key;
      if (uniqueByHost[k]) ordered.push(uniqueByHost[k]);
    }
    return ordered;
  }, [settings.public_relations_details?.socials]);

  const applySearch = (value: string) => {
    const v = value.trim();
    const next = new URLSearchParams(params);
    if (v) next.set("q", v);
    else next.delete("q");
    setParams(next, { replace: true });
    setSearchOpen(false);
    if (v) {
      if (location.pathname !== "/search") navigate("/search", { replace: false });
    } else {
      if (location.pathname !== "/") navigate("/", { replace: false });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl w-full px-4 md:px-6 py-2 md:py-2.5 grid grid-cols-3 items-center gap-3">
        {/* Left: Lang -> 974 -> Date/Time */}
        <div className="col-span-1 flex items-center gap-1 md:gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              aria-label="Azerbaijani"
              onClick={() => setLang("az")}
              className={`px-2.5 md:px-3.5 py-1.5 rounded-md text-sm font-semibold ${lang === "az" ? "bg-background text-foreground shadow" : "text-foreground/70"}`}
            >
              AZ
            </button>
            <button
              aria-label="English"
              onClick={() => setLang("en")}
              className={`px-2.5 md:px-3.5 py-1.5 rounded-md text-sm font-semibold ${lang === "en" ? "bg-background text-foreground shadow" : "text-foreground/70"}`}
            >
              EN
            </button>
          </div>


          <div className="flex flex-col text-foreground tabular-nums leading-tight">
            <span className="text-[0.7rem] leading-tight text-left">{dateParts.date}</span>
            <span className="text-[1.3rem] font-semibold leading-tight text-left">{dateParts.time}</span>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="col-span-1 flex items-center justify-center">
          <a href="https://minenergy.gov.az/" aria-label="Energetika Nazirliyinin rəsmi saytı" className="block">
            <img
              src={(lang === "az" ? settings.logo.az : settings.logo.en) || "https://cdn.builder.io/api/v1/image/assets%2F580773eac62d413f979e27499c2b5554%2F6377430ab15146f4800001679726eb9f"}
              alt="Azerbaijan Ministry of Energy"
              className="h-16 md:h-18 lg:h-20 w-auto object-contain"
            />
          </a>
        </div>

        {/* Right: Socials, Search icon, Menu */}
        <div className="col-span-1 flex items-center justify-end gap-2 md:gap-3">
          <div className="flex flex-col items-center mr-2 md:mr-3">
            <Button className="h-10 px-4 w-24 rounded-2xl text-2xl font-bold bg-primary hover:bg-primary/90">974</Button>
            <span className="block text-[10px] font-semibold text-muted-foreground text-center uppercase tracking-[0.08em] w-24 whitespace-nowrap">{lang === "az" ? "Çağrı Mərkəzi" : "Call Center"}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            {socialLinks.map((social, index) => {
              const Icon = resolveSocialIcon(social.label);
              return (
                <a
                  key={`${social.label}-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-white/80 text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{social.label}</span>
                </a>
              );
            })}
          </div>

          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none p-0">
              <div className="w-full max-w-xl mx-auto relative">
                <Input
                  autoFocus
                  placeholder={lang === "az" ? "Axtarış..." : "Search..."}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applySearch(searchText);
                  }}
                  className="h-14 md:h-16 pr-14 rounded-2xl text-lg md:text-xl shadow-lg"
                />
                <Button
                  aria-label={lang === "az" ? "Axtar" : "Search"}
                  onClick={() => applySearch(searchText)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-xl"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!isHome && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl h-10 w-10 md:h-10 md:w-10 [&_svg]:!size-6">
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
