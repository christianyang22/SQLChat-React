"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { v4 as uuid } from "uuid";

export interface DBConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface DBContextValue {
  dbs: DBConfig[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  addDb: (cfg: Omit<DBConfig, "id">) => void;
}

const DatabaseContext = createContext<DBContextValue | null>(null);

export const useDatabase = () => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error("useDatabase debe usarse dentro de DatabaseProvider");
  return ctx;
};

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [dbs, setDbs] = useState<DBConfig[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sqlchat_dbs");
    if (stored) {
      const parsed = JSON.parse(stored) as DBConfig[];
      setDbs(parsed);
      if (parsed.length) setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sqlchat_dbs", JSON.stringify(dbs));
  }, [dbs]);

  const addDb = (cfg: Omit<DBConfig, "id">) => {
    const full = { ...cfg, id: uuid() };
    setDbs((prev) => [...prev, full]);
    setActiveId(full.id);
  };

  return (
    <DatabaseContext.Provider value={{ dbs, activeId, setActiveId, addDb }}>
      {children}
    </DatabaseContext.Provider>
  );
}