"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Database,
  Trash2,
  Edit3,
} from "lucide-react";
import ConnectionModal, { Connection } from "./ConnectionModal";
import api from "@/utils/api";
import { useDatabase } from "@/context/DatabaseContext";
import { useT } from "@/lib/t";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Aside({ collapsed, onToggle }: Props) {
  const t = useT();
  const { activeId, setActiveId } = useDatabase();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [modalConn, setModalConn] = useState<Connection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const fetchConnections = async () => {
    try {
      const list = await api.get<Connection[]>("/connections");
      setConnections(list);
    } catch {}
  };

  const remove = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await api.delete(`/connections/${id}`);
      if (id === activeId) setActiveId(null);
      await fetchConnections();
    } catch {}
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filtered = collapsed
    ? connections
    : connections.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <>
      <aside
        className={`${
          collapsed ? "w-16 px-2 py-4" : "w-64 p-4"
        } bg-[var(--aside)] flex flex-col min-h-screen gap-6 transition-all duration-300 border-r border-[var(--secondary)]`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center">
              <img
                src="/sqlchat.png"
                alt="SQLChat Logo"
                className="mr-2 w-12 h-12"
              />
              <span className="text-2xl font-bold text-[var(--logo-color)]">
                SQLChat
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-[var(--logo-color)] hover:text-[var(--secondary)] hover:bg-[var(--secondary)]/20 transition"
          >
            {collapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder={t.search}
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
                onClick={() => setActiveId(db.id!)}
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
                    <Database
                      size={16}
                      className="text-[var(--logo-color)]"
                    />
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
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(db.id!);
                      }}
                      className="p-1 rounded hover:bg-red-600/20 text-red-600"
                      title={t.deleteConfirm}
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
          title="Nueva conexión"
        >
          <Plus size={20} />
        </button>
      </aside>

      {showModal && (
        <ConnectionModal
          connection={modalConn || undefined}
          onClose={() => setShowModal(false)}
          onSave={fetchConnections}
        />
      )}
    </>
  );
}