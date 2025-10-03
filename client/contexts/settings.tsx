import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PRDetails = {
  press_email?: string | null;
  phone?: string | null;
  guidelines?: { az: string; en: string }[];
  socials?: { label: string; url: string }[];
};

export type ContactDetails = {
  email?: string | null;
  phone?: string | null;
  hours_az?: string | null;
  hours_en?: string | null;
  address_az?: string | null;
  address_en?: string | null;
  map_url?: string | null;
};

export type Settings = {
  logo: { az: string | null; en: string | null };
  placeholder: string | null;
  public_relations_details?: PRDetails;
  contact_details?: ContactDetails;
};

const defaultSettings: Settings = {
  logo: { az: null, en: null },
  placeholder: "/placeholder.svg",
  public_relations_details: undefined,
  contact_details: undefined,
};

const SettingsContext = createContext<Settings>(defaultSettings);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    let cancelled = false;

    const ensureAbsolute = (path: string | null | undefined) => {
      if (!path) return null;
      if (/^https?:\/\//i.test(path)) return path;
      return `https://euib.onecorp.cloud/storage/${path.replace(/^\/+/, "")}`;
    };

    fetch("https://euib.onecorp.cloud/api/settings")
      .then(async (r) => {
        if (!r.ok) throw new Error("settings fetch failed");
        return (await r.json()) as any;
      })
      .then((data) => {
        if (cancelled) return;
        setSettings((prev) => ({
          logo: {
            az: ensureAbsolute((data.logo?.az ?? data.logo_az) ?? prev.logo.az),
            en: ensureAbsolute((data.logo?.en ?? data.logo_en) ?? prev.logo.en),
          },
          placeholder: ensureAbsolute(data.placeholder) ?? prev.placeholder,
          public_relations_details: data.public_relations_details ?? prev.public_relations_details,
          contact_details: data.contact_details ?? prev.contact_details,
        }));
      })
      .catch(() => {
        // keep defaults on failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => settings, [settings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
