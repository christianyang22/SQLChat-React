"use client";

import { useState } from "react";
import {
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Database as DbIcon,
  Trash2,
  Edit3,
} from "lucide-react";
import ConnectionModal from "./ConnectionModal";
import api from "@/utils/api";
import { useDatabase, DBConfig } from "@/context/DatabaseContext";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Aside({ collapsed, onToggle }: Props) {
  const { dbs, activeId, setActiveId } = useDatabase();
  const [modalConn, setModalConn] = useState<DBConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = collapsed
    ? dbs
    : dbs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <aside
        className={`aside ${
          collapsed ? "w-16 px-2 py-4" : "w-64 p-4"
        } bg-[var(--aside)] flex flex-col min-h-screen gap-6 transition-all duration-300 border-r border-[var(--secondary)]`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          {!collapsed && (
            <>
              <img src="/sqlchat.png" alt="Logo" className="w-10 h-10 mr-2" />
              <span className="text-2xl font-bold text-[var(--logo-color)]">
                SQLChat
              </span>
            </>
          )}
          <button
            onClick={onToggle}
            className="ml-auto p-1 rounded-md text-[var(--logo-color)] hover:text-[var(--secondary)] hover:bg-[var(--secondary)]/20 transition"
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>

        {!collapsed && (
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pr-8 px-2 py-1 rounded-md bg-[var(--card)] border border-[var(--secondary)] text-sm focus:outline-none"
            />
            <Search
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--logo-color)] pointer-events-none"
            />
          </div>
        )}

        <ul
          className={`${
            collapsed ? "space-y-4 pt-6" : "space-y-2"
          } text-sm flex-1 overflow-auto`}
        >
          {filtered.map((db) => {
            const isActive = db.id === activeId;
            return (
              <li
                key={db.id}
                onClick={() => setActiveId(db.id)}
                className={`group cursor-pointer flex items-center ${
                  collapsed ? "justify-center" : "gap-2 px-2"
                } ${
                  isActive
                    ? "text-[var(--secondary)] font-semibold"
                    : "hover:text-[var(--secondary)]"
                } transition`}
                title={db.name}
              >
                {collapsed ? (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--secondary)] text-black pointer-events-none">
                    {db.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <>
                    <DbIcon size={16} className="text-[var(--logo-color)]" />
                    <span className="flex-1 truncate">{db.name}</span>
                  </>
                )}

                {!collapsed && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalConn(db);
                        setShowModal(true);
                      }}
                      className="p-1 rounded hover:bg-[var(--secondary)]/20 text-[var(--logo-color)]"
                      title="Editar conexión"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await api.delete(`/connections/${db.id}`);
                        window.location.reload();
                      }}
                      className="p-1 rounded hover:bg-red-600/20 text-red-600"
                      title="Eliminar conexión"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => {
            setModalConn(null);
            setShowModal(true);
          }}
          className="mx-auto p-3 rounded-full border border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)]/20 transition"
          title="Crear nueva conexión"
        >
          <Plus size={20} />
        </button>
      </aside>

      {showModal && (
        <ConnectionModal
          connection={modalConn ?? undefined}
          onClose={() => setShowModal(false)}
          onSave={() => window.location.reload()}
        />
      )}
    </>
  );
}