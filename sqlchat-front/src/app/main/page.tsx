"use client";

import { useState, useEffect, FormEvent, useRef, KeyboardEvent } from "react";
import Aside from "@/app/components/Aside";
import Header from "@/app/components/Header";
import { ClipboardPaste, Send, DatabaseIcon, X as CloseIcon } from "lucide-react";
import { useT } from "@/lib/t";
import api from "@/utils/api";
import { useDatabase } from "@/context/DatabaseContext";
import { v4 as uuid } from "uuid";
import { TourProvider, useTour } from "@reactour/tour";

type Message = { role: "user" | "assistant"; content: string };
type Result = {
  id: string;
  name: string;
  cols: string[];
  rows: Record<string, any>[];
  pending: boolean;
};

const tourSteps = [
  { selector: 'button[title="Crear nueva conexión"]', content: "Pulsa aquí para crear una nueva conexión a tu base de datos." },
  { selector: ".aside", content: "Esta área muestra todas tus conexiones; cuando crees la primera, aparecerá aquí. Pulsa en una para activarla." },
  { selector: ".table-nav", content: "Selecciona aquí la tabla que quieres explorar." },
  { selector: ".query-input", content: "Escribe tu pregunta en lenguaje natural en este cuadro." },
  { selector: ".send-button", content: "Pulsa aquí para enviar tu consulta y generar el SQL." },
  { selector: ".results-table", content: "Los resultados o la vista previa de la mutación aparecen en esta zona." },
  { selector: "button.profile-button", content: "Desde aquí abres tu perfil para configuración o cerrar sesión." },
];

const isGeneralChat = (txt: string) => {
  const lower = txt.toLowerCase();
  return [
    "chiste",
    "quién eres",
    "explica",
    "qué es",
    "cuál es tu nombre",
    "teoría de",
    "definición de",
    "cuándo naciste",
    "cuántos años tienes",
    "significado de",
    "qué opinas",
    "resumen de",
    "resume",
    "cómo estás",
  ].some(x => lower.includes(x));
};

const isSQLQuery = (txt: string, activeId: number | null, selectedTable: string) => {
  return !!activeId && !!selectedTable && !isGeneralChat(txt);
};

function isFallbackText(text: string | undefined) {
  if (!text) return true;
  const lower = text.toLowerCase();
  return (
    lower.trim() === "" ||
    lower.includes("no tengo información") ||
    lower.includes("no lo sé") ||
    lower.includes("no puedo") ||
    lower.includes("lo siento")
  );
}

export default function MainPage() {
  return (
    <TourProvider
      steps={tourSteps}
      styles={{
        maskArea: (base) => ({ ...base, backgroundColor: "rgba(0,0,0,0.5)" }),
        popover: (base) => ({
          ...base,
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--secondary)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: "var(--secondary)",
          color: "#fff",
          borderRadius: "4px",
        }),
        close: (base) => ({
          ...base,
          color: "var(--secondary)",
          fontSize: "1.2em",
        }),
      }}
    >
      <MainPageInner />
    </TourProvider>
  );
}

function MainPageInner() {
  const t = useT();
  const { activeId, tables } = useDatabase();
  const { isOpen, setCurrentStep, setIsOpen } = useTour();

  useEffect(() => {
    if (localStorage.getItem("tourSeen") !== "true") {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [setCurrentStep, setIsOpen]);

  useEffect(() => {
    if (isOpen === false) localStorage.setItem("tourSeen", "true");
  }, [isOpen]);

  const [asideOpen, setAsideOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("asideAbierto") !== "false";
  });
  useEffect(() => {
    localStorage.setItem("asideAbierto", String(asideOpen));
  }, [asideOpen]);

  const [selectedTable, setSelectedTable] = useState<string>("");
  useEffect(() => {
    setSelectedTable(tables[0] || "");
  }, [tables]);

  const [previewCols, setPreviewCols] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, any>[]>([]);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [lastSQL, setLastSQL] = useState<string>("");

  const loadPreview = async () => {
    if (!activeId || !selectedTable) return;
    setLoadingPreview(true);
    try {
      const res = await api.post<{ sql: string; rows: any[] }>(
        `/query/?connection_id=${activeId}`,
        { message: `SELECT * FROM ${selectedTable} LIMIT 50;`, table: selectedTable }
      );
      setPreviewCols(Object.keys(res.rows[0] || {}));
      setPreviewRows(res.rows);
    } catch {
      setPreviewCols([]);
      setPreviewRows([]);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [activeId, selectedTable]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [activeResult, setActiveResult] = useState<string | null>(null);

  const [input, setInput] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autosize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxH = ta.clientHeight * 3;
    ta.style.height = `${Math.min(ta.scrollHeight, maxH)}px`;
  };
  useEffect(() => autosize(), [input]);

  const paste = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      setInput((i) => i + txt);
      setTimeout(autosize, 0);
    } catch {}
  };

  const closeResult = (id: string) => {
    setResults((rs) => rs.filter((r) => r.id !== id));
    if (activeResult === id) setActiveResult(null);
  };

  const handleChatAndSearchFallback = async (txt: string) => {
    let chatRes: { text: string } | null = null;
    try {
      chatRes = await api.post<{ text: string }>("/chat/", { message: txt });
      const text = chatRes?.text;
      if (text && !isFallbackText(text)) {
        setMessages(ms => [...ms, { role: "assistant", content: text }]);
      }
    } catch (chatError) {
      chatRes = null;
    }

    const fallbackNeeded = !chatRes || isFallbackText(chatRes?.text);

    if (fallbackNeeded) {
      try {
        const searchRes = await api.post<{ result: string }>("/search/", { query: txt });
        if (searchRes && searchRes.result) {
          setMessages((ms) => [
            ...ms,
            { role: "assistant", content: searchRes.result },
          ]);
        }
      } catch (searchErr: any) {
        setMessages((ms) => [
          ...ms,
          { role: "assistant", content: searchErr?.message || "Error buscando en internet" },
        ]);
      }
    }
  };

  const submitChat = async (confirm = false, previewId?: string) => {
    let txt: string;
    if (previewId) {
      txt = lastSQL;
    } else {
      txt = input.trim();
      if (!txt) return;
      setMessages((ms) => [...ms, { role: "user", content: txt }]);
      setInput("");
    }

    setLoadingChat(true);

    try {
      if (isSQLQuery(txt, activeId, selectedTable)) {
        const url = confirm
          ? `/query/?connection_id=${activeId}&confirm=true`
          : `/query/?connection_id=${activeId}`;
        try {
          const res = await api.post<{ sql: string; rows: any[] }>(url, {
            message: txt,
            table: selectedTable,
          });

          const { sql, rows } = res;

          if (!rows || rows.length === 0) {
            await handleChatAndSearchFallback(txt);
            setLoadingChat(false);
            return;
          }

          setLastSQL(sql);
          setMessages((ms) => [...ms, { role: "assistant", content: `SQL: ${sql}` }]);

          const isMut = /^(UPDATE|DELETE|INSERT)/i.test(sql.trim());
          if (isMut) {
            if (!confirm) {
              const id = uuid();
              setResults((rs) => [
                ...rs,
                {
                  id,
                  name: `Vista previa ${rs.length + 1}`,
                  cols: Object.keys(rows[0] || {}),
                  rows,
                  pending: true,
                },
              ]);
              setActiveResult(id);
            } else {
              if (previewId) closeResult(previewId);
              setActiveResult(null);
              await loadPreview();

              //await reloadTables();
            }
            setLoadingChat(false);
            return;
          }
          if (rows.length) {
            const id = uuid();
            setResults((rs) => [
              ...rs,
              {
                id,
                name: `Resultado ${rs.length + 1}`,
                cols: Object.keys(rows[0] || {}),
                rows,
                pending: false,
              },
            ]);
            setActiveResult(id);
          }
        } catch (err) {
          await handleChatAndSearchFallback(txt);
        }
      } else if (!isGeneralChat(txt)) {
        try {
          const searchRes = await api.post<{ result: string }>("/search/", { query: txt });
          if (searchRes && searchRes.result) {
            setMessages((ms) => [...ms, { role: "assistant", content: searchRes.result }]);
            setLoadingChat(false);
            return;
          }
        } catch (err) {}
        await handleChatAndSearchFallback(txt);
      } else {
        await handleChatAndSearchFallback(txt);
      }
    } catch (e: any) {
      setMessages((ms) => [
        ...ms,
        { role: "assistant", content: e.message || "Error en consulta" },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitChat();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitChat();
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Aside collapsed={!asideOpen} onToggle={() => setAsideOpen((o) => !o)} />
      <div className="flex flex-col flex-1">
        <Header showBurger={asideOpen} onBurgerClick={() => setAsideOpen((o) => !o)} />

        <nav
          className="table-nav flex items-center px-4 border-t border-b border-[var(--secondary)]"
          style={{ height: "3rem" }}
        >
          <DatabaseIcon size={20} className="text-[var(--secondary)] mr-2" />
          {tables.map((tbl) => (
            <button
              key={tbl}
              onClick={() => {
                setSelectedTable(tbl);
                setActiveResult(null);
              }}
              className={`cursor-pointer px-4 py-1 rounded-t-lg transition ${
                tbl === selectedTable && activeResult === null
                  ? "bg-[var(--card)] text-[var(--foreground)]"
                  : "bg-transparent text-[var(--secondary)] hover:bg-[var(--card)]"
              }`}
            >
              {tbl}
            </button>
          ))}
          {results.map((r) => (
            <div key={r.id} className="relative ml-2 flex items-center">
              <button
                onClick={() => setActiveResult(r.id)}
                className={`cursor-pointer px-4 py-1 rounded-t-lg transition ${
                  activeResult === r.id
                    ? "bg-[var(--card)] text-[var(--foreground)]"
                    : "bg-transparent text-[var(--secondary)] hover:bg-[var(--card)]"
                }`}
              >
                {r.name}
              </button>
              <CloseIcon
                size={12}
                className="absolute top-1 right-0 cursor-pointer text-[var(--secondary)] hover:text-[var(--foreground)]"
                onClick={() => closeResult(r.id)}
              />
            </div>
          ))}
        </nav>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className="results-table overflow-auto p-4"
            style={{ flexBasis: "30%", flexGrow: 0 }}
          >
            {activeResult === null ? (
              loadingPreview ? (
                <div className="text-center text-[var(--secondary)]">Cargando datos…</div>
              ) : previewCols.length > 0 ? (
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-[var(--card)]">
                      {previewCols.map((col) => (
                        <th key={col} className="border px-2 py-1 text-left text-[var(--secondary)]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b ${
                          i % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]/50"
                        }`}
                      >
                        {previewCols.map((col) => (
                          <td key={col} className="px-2 py-1">
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-[var(--secondary)]">
                  Selecciona una tabla o ejecuta una consulta
                </div>
              )
            ) : (
              (() => {
                const r = results.find((x) => x.id === activeResult)!;
                return (
                  <>
                    <table className="min-w-full table-auto border-collapse mb-4">
                      <thead>
                        <tr className="bg-[var(--card)]">
                          {r.cols.map((c) => (
                            <th
                              key={c}
                              className="border px-2 py-1 text-left text-[var(--secondary)]"
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {r.rows.map((row, i) => (
                          <tr
                            key={i}
                            className={`border-b ${
                              i % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]/50"
                            }`}
                          >
                            {r.cols.map((c) => (
                              <td key={c} className="px-2 py-1">
                                {String(row[c])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {r.pending && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-[var(--secondary)] text-[var(--background)] rounded hover:opacity-90 transition"
                          onClick={() => submitChat(true, r.id)}
                          disabled={loadingChat}
                        >
                          Confirmar cambios
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-90 transition"
                          onClick={() => closeResult(r.id)}
                          disabled={loadingChat}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </div>

          <main className="flex flex-col p-4 overflow-auto" style={{ flexBasis: "70%", flexGrow: 1 }}>
            <div className="flex flex-col flex-1 overflow-auto space-y-4 pr-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 ${
                    m.role === "user"
                      ? "self-end max-w-[70%] bg-teal-600 text-white font-semibold text-right"
                      : "self-start w-full bg-[var(--card)] text-[var(--foreground)]"
                  }`}
                >
                  <pre className="whitespace-pre-wrap text-sm m-0">{m.content}</pre>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="relative p-0 mt-2">
              <textarea
                ref={textareaRef}
                onInput={autosize}
                onKeyDown={handleKeyDown}
                className="query-input w-full resize-none overflow-y-auto bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                style={{ maxHeight: "300%" }}
                rows={2}
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                type="button"
                onClick={paste}
                className="cursor-pointer absolute top-2 right-4 p-1 text-[var(--secondary)] hover:text-[var(--foreground)] transition"
                title="Pegar del portapapeles"
              >
                <ClipboardPaste size={18} />
              </button>

              <button
                type="submit"
                disabled={loadingChat || (!activeId && !selectedTable)}
                className="send-button cursor-pointer absolute bottom-2 right-4 p-1.5 bg-[var(--secondary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full disabled:opacity-50 transition"
              >
                <Send size={16} />
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}