import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "az" | "en";

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (az: string, en: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "lang";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const fromStorage =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
        : null;
    return fromStorage === "az" || fromStorage === "en" ? fromStorage : "az"; // default AZ
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const t = useMemo(
    () => (az: string, en: string) => (lang === "az" ? az : en),
    [lang],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    if (q === "az" || q === "en") setLang(q);
  }, []);

  const firstRunRef = React.useRef(true);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    const src = "https://accessibility.cert.gov.az/acc-widget.min.js";
    // Remove existing widget container first
    document.querySelectorAll('.accw-container').forEach((el) => el.parentElement?.removeChild(el));
    // Remove existing script tag(s)
    document.querySelectorAll(`script[src="${src}"]`).forEach((el) => el.parentElement?.removeChild(el));
    // Re-inject script
    const s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
