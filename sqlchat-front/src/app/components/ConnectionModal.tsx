"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/utils/api";
import { Trash2 } from "lucide-react";

export type Connection = {
  id?: string;
  name: string;
  engine: "postgres" | "mysql" | "mariadb" | "sqlite";
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

type Props = {
  connection?: Connection;
  onClose: () => void;
  onSave: () => void;
};

export default function ConnectionModal({ connection, onClose, onSave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isEdit = Boolean(connection?.id);

  const [name, setName] = useState(connection?.name || "");
  const [engine, setEngine] = useState<Connection["engine"]>(
    connection?.engine || "postgres"
  );
  const [host, setHost] = useState(connection?.host || "");
  const [port, setPort] = useState(connection?.port || 5432);
  const [user, setUser] = useState(connection?.user || "");
  const [password, setPassword] = useState(connection?.password || "");
  const [database, setDatabase] = useState(connection?.database || "");

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", click);
    return () => window.removeEventListener("mousedown", click);
  }, [onClose]);

  const save = async () => {
    const payload = { name: name || host, engine, host, port, user, password, database };
    try {
      if (isEdit && connection!.id) {
        await api.put(`/connections/${connection!.id}`, payload);
      } else {
        await api.post("/connections", payload);
      }
      onSave();
      onClose();
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={ref}
        className="w-full max-w-md bg-[var(--card)] border border-[var(--secondary)] p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-[var(--secondary)]">
          {isEdit ? "Editar conexión" : "Nueva conexión"}
        </h2>
        <div className="space-y-3">
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value as any)}
            className="input"
          >
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mariadb">MariaDB</option>
            <option value="sqlite">SQLite</option>
          </select>
          <input
            placeholder="Alias"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Host"
            className="input"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <input
            placeholder="Puerto"
            className="input"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
          />
          <input
            placeholder="Usuario"
            className="input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            placeholder="Contraseña"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            placeholder="Base de datos"
            className="input"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={save}
            className="px-4 py-2 bg-[var(--secondary)] text-black rounded"
          >
            {isEdit ? "Guardar cambios" : "Guardar"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--secondary)] rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}