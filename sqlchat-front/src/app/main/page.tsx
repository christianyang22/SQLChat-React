"use client";

import { useState, useEffect } from "react";
import Aside from "@/app/components/Aside";
import Header from "@/app/components/Header";
import {
  ClipboardPaste,
  Send,
  Copy,
  Download,
  Maximize2,
  X,
} from "lucide-react";
import { useT } from "@/lib/t";
import api from "@/utils/api";
import { useDatabase } from "@/context/DatabaseContext";

export default function MainPage() {
  const t = useT();
  const { activeId } = useDatabase();
  const [asideOpen, setAsideOpen] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("asideAbierto") === "false"
      ? false
      : true
  );
  const [question, setQuestion] = useState("");
  const [sql, setSql] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const MAX_ROWS = 100;
  const displayRows = rows.slice(0, MAX_ROWS);

  useEffect(() => {
    localStorage.setItem("asideAbierto", asideOpen.toString());
  }, [asideOpen]);

  const paste = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      setQuestion((q) => q + txt);
    } catch {}
  };

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sql);
    } catch {}
  };

  const saveCsv = () => {
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const lines = [
      cols.join(","),
      ...rows.map((r) =>
        cols
          .map((c) => {
            const cell = r[c] ?? "";
            return `"${String(cell).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const send = async () => {
    if (!question.trim() || !activeId) return;
    setLoading(true);
    setSql("");
    setResultMsg("");
    setRows([]);
    try {
      const { sql: generated, rows: data } = await api.post<{
        sql: string;
        rows: any[];
      }>("/query", { connection_id: activeId, question });
      setSql(generated);
      setRows(data);
      if (data.length === 0) {
        setResultMsg(t.noData);
      }
    } catch (err: any) {
      setSql("-- error --");
      setResultMsg(err?.response?.data?.detail ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Aside collapsed={!asideOpen} onToggle={() => setAsideOpen((o) => !o)} />
      <div className="flex flex-col flex-1">
        <Header
          showBurger={asideOpen}
          onBurgerClick={() => setAsideOpen((o) => !o)}
        />
        <div className="flex flex-1 p-6 gap-6 overflow-auto">
          <section className="w-1/2 flex flex-col gap-6">
            <div>
              <h3 className="text-[var(--secondary)] font-semibold mb-1">
                {t.question}
              </h3>
              <div className="relative">
                <textarea
                  placeholder={t.placeholder}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full h-32 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 pr-10 pb-10 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                />
                <button
                  onClick={paste}
                  className="absolute top-3 right-3 text-[var(--secondary)]"
                >
                  <ClipboardPaste size={18} />
                </button>
                <button
                  onClick={send}
                  disabled={loading || !activeId}
                  title={!activeId ? t.selectConnection : ""}
                  className="absolute bottom-3 right-3 text-[var(--secondary)] disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-[var(--secondary)] font-semibold mb-1">
                {t.generatedQuery}
              </h3>
              <div className="relative">
                <textarea
                  readOnly
                  value={sql}
                  className="w-full h-24 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 pr-10 resize-none"
                />
                <button
                  onClick={copySql}
                  className="absolute top-3 right-3 text-[var(--secondary)]"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </section>
          <section className="flex-1 flex flex-col">
            <h3 className="text-[var(--secondary)] font-semibold mb-1">
              {t.resultTable}
            </h3>
            <div className="relative flex-1 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 overflow-auto">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={saveCsv}
                  disabled={rows.length === 0}
                  className="text-[var(--secondary)] disabled:opacity-50"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setExpanded(true)}
                  disabled={rows.length === 0}
                  className="text-[var(--secondary)] disabled:opacity-50"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
              {loading ? (
                <p className="text-sm italic">{t.loading}</p>
              ) : rows.length > 0 ? (
                <>
                  <div className="mt-8 overflow-x-auto">
                    <table className="min-w-max border-collapse text-sm">
                      <thead>
                        <tr>
                          {Object.keys(displayRows[0]).map((col) => (
                            <th
                              key={col}
                              className="border px-2 py-1 bg-[var(--secondary)] text-black"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayRows.map((row, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-[var(--background)]" : ""}
                          >
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="border px-2 py-1">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rows.length > MAX_ROWS && (
                    <p className="mt-2 text-xs italic">
                      Mostrando {MAX_ROWS} de {rows.length} registros...
                    </p>
                  )}
                </>
              ) : (
                <pre className="text-sm whitespace-pre-wrap">{resultMsg}</pre>
              )}
            </div>
          </section>
        </div>
        {expanded && (
          <div
            className="fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-10"
            onClick={() => setExpanded(false)}
          >
            <div
              className="relative bg-[var(--card)] text-[var(--foreground)] p-6 rounded-xl w-full h-full overflow-auto border border-[var(--secondary)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 text-[var(--secondary)]"
              >
                <X size={22} />
              </button>
              {rows.length > 0 ? (
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-max border-collapse text-sm">
                    <thead>
                      <tr>
                        {Object.keys(rows[0]).map((col) => (
                          <th
                            key={col}
                            className="border px-2 py-1 bg-[var(--secondary)] text-black"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-[var(--background)]" : ""}
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="border px-2 py-1">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{resultMsg}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}