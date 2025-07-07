"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/utils/api";
import { DBConfig } from "@/context/DatabaseContext";

type Props = {
  connection?: DBConfig;
  onClose: () => void;
  onSave: () => void;
};

export default function ConnectionModal({ connection, onClose, onSave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isEdit = Boolean(connection);

  const [form, setForm] = useState<DBConfig>(
    connection ?? {
      id: 0,
      name: "",
      engine: "postgres",
      host: "",
      port: 5432,
      user: "",
      password: "",
      database: "",
    }
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);

  const save = async () => {
    const payload = { ...form };
    if (isEdit) {
      await api.put(`/connections/${form.id}`, payload);
    } else {
      await api.post("/connections", payload);
    }
    onSave();
    onClose();
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

        <select
          value={form.engine}
          onChange={(e) =>
            setForm((f) => ({ ...f, engine: e.target.value as DBConfig["engine"] }))
          }
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
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          placeholder="Host"
          className="input"
          value={form.host}
          onChange={(e) => setForm((f) => ({ ...f, host: e.target.value }))}
        />
        <input
          placeholder="Puerto"
          className="input"
          type="number"
          value={form.port}
          onChange={(e) => setForm((f) => ({ ...f, port: Number(e.target.value) }))}
        />
        <input
          placeholder="Usuario"
          className="input"
          value={form.user}
          onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
        />
        <input
          placeholder="Contraseña"
          className="input"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <input
          placeholder="Base de datos"
          className="input"
          value={form.database}
          onChange={(e) => setForm((f) => ({ ...f, database: e.target.value }))}
        />

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