"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import api from "@/utils/api";
import { DBConfig } from "@/context/DatabaseContext";
import { Upload } from "lucide-react";

type Props = {
  connection?: DBConfig;
  onClose: () => void;
  onSave: () => void;
};

const ENGINE_DEFAULTS: Record<string, { host: string; port: number }> = {
  postgres: { host: "db", port: 5432 },
  mysql: { host: "sqlchat_mysql", port: 3306 },
  mariadb: { host: "sqlchat_mariadb", port: 3306 },
  sqlite: { host: "", port: 0 },
};

const SUPPORTED_ENGINES = ["postgres", "mysql", "mariadb", "sqlite"];

const getSafeValue = (obj: any, key: string) =>
  typeof obj[key] === "undefined" || obj[key] === null ? "" : obj[key];

const initialForm = (connection?: DBConfig): DBConfig => {
  const engine = connection?.engine ?? "postgres";
  return {
    id: connection?.id ?? 0,
    name: connection?.name ?? "",
    engine,
    host: connection?.host ?? ENGINE_DEFAULTS[engine].host,
    port: connection?.port ?? ENGINE_DEFAULTS[engine].port,
    user: connection?.user ?? "",
    password: connection?.password ?? "",
    database: connection?.database ?? "",
  };
};

type FileInputProps = {
  id?: string;
  accept: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  label?: string;
};

function FileInput({
  id = "file-upload",
  accept,
  onChange,
  file,
  label = "Seleccionar archivo",
}: FileInputProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--secondary)] bg-[var(--card)] text-[var(--secondary)] cursor-pointer hover:bg-[var(--secondary)]/20 transition"
        style={{ minWidth: 0 }}
      >
        <Upload size={18} className="shrink-0" />
        <span className="truncate">{label}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
      </label>
      <span className="ml-2 text-sm text-[var(--secondary)] truncate" style={{ maxWidth: "160px" }}>
        {file ? file.name : "Ningún archivo seleccionado"}
      </span>
    </div>
  );
}

export default function ConnectionModal({ connection, onClose, onSave }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isEdit = Boolean(connection);

  const [tab, setTab] = useState<"direct" | "script">("direct");
  const [form, setForm] = useState<DBConfig>(() => initialForm(connection));
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [sqlFile, setSqlFile] = useState<File | null>(null);
  const [sqliteFile, setSqliteFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEngineChange = (newEngine: DBConfig["engine"]) => {
    setForm((f) => ({
      ...f,
      engine: newEngine,
      host: ENGINE_DEFAULTS[newEngine].host,
      port: ENGINE_DEFAULTS[newEngine].port,
      user: newEngine === "sqlite" ? "" : f.user,
      password: newEngine === "sqlite" ? "" : f.password,
      database: f.database,
      name: f.name,
    }));
    setSqlFile(null);
    setSqliteFile(null);
  };

  useEffect(() => {
    setForm(initialForm(connection));
  }, [connection]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [onClose]);

  const checkSQLFileEngine = async (file: File) => {
    const text = await file.text();
    const lowered = text.toLowerCase();
    if (
      lowered.includes("oracle") ||
      lowered.includes("sqlserver") ||
      lowered.includes("mssql") ||
      lowered.includes("db2") ||
      lowered.includes("firebird")
    ) {
      setError(
        "El script SQL parece ser de un motor de base de datos NO soportado (por ejemplo: Oracle, SQL Server, DB2, Firebird, etc). Solo se admiten PostgreSQL, MySQL, MariaDB y SQLite."
      );
      setSqlFile(null);
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!SUPPORTED_ENGINES.includes(form.engine)) {
      setError(
        "Motor de base de datos no soportado. Solo se admiten PostgreSQL, MySQL, MariaDB y SQLite."
      );
      return;
    }

    if (tab === "script") {
      if (form.engine === "sqlite" && sqliteFile) {
        const data = new FormData();
        data.append("engine", form.engine);
        data.append("name", form.name);
        data.append("database", form.database);
        data.append("file", sqliteFile);
        try {
          await api.post("/connections/upload-sqlite", data);
        } catch (e: any) {
          setError(
            e?.response?.data
              ? typeof e.response.data === "object"
                ? JSON.stringify(e.response.data, null, 2)
                : e.response.data
              : e.message || "Error desconocido al cargar el archivo SQLite."
          );
          return;
        }
      } else if (sqlFile) {
        const ok = await checkSQLFileEngine(sqlFile);
        if (!ok) return;
        const data = new FormData();
        data.append("file", sqlFile);
        data.append("engine", form.engine);
        data.append("host", form.host);
        data.append("port", String(form.port));
        data.append("admin_user", adminUser);
        data.append("admin_password", adminPassword);
        data.append("new_db", form.database);
        data.append("name", form.name);
        try {
          await api.post("/connections/upload-sql", data);
        } catch (e: any) {
          setError(
            e?.response?.data
              ? typeof e.response.data === "object"
                ? JSON.stringify(e.response.data, null, 2)
                : e.response.data
              : e.message || "Error desconocido al cargar el script SQL."
          );
          return;
        }
      }
      onSave();
      onClose();
      return;
    }

    if (form.engine === "sqlite" && sqliteFile) {
      const data = new FormData();
      data.append("engine", form.engine);
      data.append("name", form.name);
      data.append("database", form.database);
      data.append("file", sqliteFile);
      try {
        await api.post("/connections/upload-sqlite", data);
      } catch (e: any) {
        setError(
          e?.response?.data
            ? typeof e.response.data === "object"
              ? JSON.stringify(e.response.data, null, 2)
              : e.response.data
            : e.message || "Error desconocido al cargar el archivo SQLite."
        );
        return;
      }
    } else if (isEdit) {
      await api.put(`/connections/${form.id}`, { ...form });
    } else {
      await api.post("/connections", { ...form });
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
        <div className="flex gap-2 mb-3">
          <button
            className={`px-4 py-2 rounded-t-lg border-b-2 ${
              tab === "direct"
                ? "border-[var(--secondary)] font-bold"
                : "border-transparent"
            }`}
            onClick={() => setTab("direct")}
          >
            Conexión directa
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg border-b-2 ${
              tab === "script"
                ? "border-[var(--secondary)] font-bold"
                : "border-transparent"
            }`}
            onClick={() => setTab("script")}
          >
            Subir Script SQL
          </button>
        </div>
        <select
          value={form.engine}
          onChange={(e) => handleEngineChange(e.target.value as DBConfig["engine"])}
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
        {tab === "direct" &&
          (form.engine !== "sqlite" ? (
            <>
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
            </>
          ) : (
            <>
              <input
                placeholder="Archivo .db o nombre lógico"
                className="input"
                value={form.database}
                onChange={(e) =>
                  setForm((f) => ({ ...f, database: e.target.value }))
                }
              />
              <span className="block text-sm mt-2">O cargar archivo SQLite (.db):</span>
              <FileInput
                id="sqlite-upload-direct"
                accept=".db"
                file={sqliteFile}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSqliteFile(file);
                }}
                label="Seleccionar archivo .db"
              />
            </>
          ))}
        {tab === "script" && (
          <>
            {form.engine !== "sqlite" ? (
              <>
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
                  placeholder="Usuario administrador"
                  className="input"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                />
                <input
                  placeholder="Contraseña administrador"
                  className="input"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <input
                  placeholder="Nombre de nueva base de datos"
                  className="input"
                  value={form.database}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, database: e.target.value }))
                  }
                />
                <span className="block text-sm mt-2">Cargar archivo SQL:</span>
                <FileInput
                  id="sql-upload-script"
                  accept=".sql"
                  file={sqlFile}
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      const ok = await checkSQLFileEngine(file);
                      if (ok) setSqlFile(file);
                    } else {
                      setSqlFile(null);
                    }
                  }}
                  label="Seleccionar archivo .sql"
                />
              </>
            ) : (
              <>
                <input
                  placeholder="Archivo .db o nombre lógico"
                  className="input"
                  value={form.database}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, database: e.target.value }))
                  }
                />
                <span className="block text-sm mt-2">Cargar archivo SQLite (.db):</span>
                <FileInput
                  id="sqlite-upload-script"
                  accept=".db"
                  file={sqliteFile}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSqliteFile(file);
                  }}
                  label="Seleccionar archivo .db"
                />
              </>
            )}
          </>
        )}
        {error && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-red-600/95 text-white rounded-xl shadow-lg px-8 py-6 max-w-xs mx-auto text-center flex flex-col items-center gap-4">
              <span className="text-lg font-bold">Error</span>
              <pre className="text-sm whitespace-pre-wrap">{error}</pre>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 mt-2 rounded bg-white text-red-700 font-semibold shadow hover:bg-gray-100 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
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