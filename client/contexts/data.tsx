import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Section } from "@/data/boardData";
import { boardData } from "@/data/boardData";

export type DataContextValue = {
  menu: Section[];
};

const DataContext = createContext<DataContextValue>({ menu: boardData.menu });

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<Section[]>(boardData.menu);

  useEffect(() => {
    let cancelled = false;
    fetch("https://euib.onecorp.cloud/api/menu")
      .then(async (r) => {
        if (!r.ok) throw new Error("menu fetch failed");
        return (await r.json()) as any;
      })
      .then((data) => {
        if (cancelled) return;
        const next = Array.isArray(data) ? data : (data?.menu ?? []);
        if (Array.isArray(next) && next.length) setMenu(next as Section[]);
      })
      .catch(() => {
        // keep local mocked data on failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ menu }), [menu]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
