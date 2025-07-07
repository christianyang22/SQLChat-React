"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface DBConfig {
  id: number;
  name: string;
  engine: "postgres" | "mysql" | "mariadb" | "sqlite";
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface DBContextValue {
  dbs: DBConfig[];
  activeId: number | null;
  setActiveId: (id: number | null) => void;
  tables: string[];
}

const DatabaseContext = createContext<DBContextValue | null>(null);

export const useDatabase = (): DBContextValue => {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error("useDatabase must be used inside DatabaseProvider");
  return ctx;
};

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [dbs, setDbs] = useState<DBConfig[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

  useEffect(() => {
    if (!token) {
      setDbs([]);
      setActiveId(null);
      return;
    }

    fetch(`${API_BASE}/connections`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        return res.json() as Promise<DBConfig[]>;
      })
      .then((list) => {
        setDbs(list);
        setActiveId(list.length ? list[0].id : null);
      })
      .catch(() => {
        setDbs([]);
        setActiveId(null);
      });
  }, [token]);

  useEffect(() => {
    if (activeId === null || !token) {
      setTables([]);
      return;
    }

    fetch(`${API_BASE}/tables?connection_id=${activeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }
        return res.json() as Promise<string[]>;
      })
      .then((list) => {
        setTables(list);
      })
      .catch(() => {
        setTables([]);
      });
  }, [activeId, token]);

  return (
    <DatabaseContext.Provider value={{ dbs, activeId, setActiveId, tables }}>
      {children}
    </DatabaseContext.Provider>
  );
}