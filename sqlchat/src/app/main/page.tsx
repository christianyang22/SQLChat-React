"use client";

import Header from "../components/header";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FilePen,
  Database,
  ChevronsLeft,
  ChevronsRight,
  ClipboardPaste,
  Send,
  Copy,
  Download,
  Maximize2,
  X,
} from "lucide-react";

export default function MainPage() {
  const [pregunta, setPregunta] = useState("");
  const [consultaSQL, setConsultaSQL] = useState("SELECT *\nFROM BBDD");
  const [resultado, setResultado] = useState("");
  const [expandido, setExpandido] = useState(false);
  const [asideAbierto, setAsideAbierto] = useState(
    typeof window !== "undefined" && localStorage.getItem("asideAbierto") === "false"
      ? false
      : true
  );

  useEffect(() => {
    localStorage.setItem("asideAbierto", asideAbierto.toString());
  }, [asideAbierto]);

  const bases = [
    "Base de datos madrid",
    "Base de datos andalucia",
    "Base de datos galicia",
    "Base de datos leon",
  ];

  const handlePegar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      setPregunta((prev) => prev + texto);
    } catch {}
  };

  const handleCopiarConsulta = async () => {
    try {
      await navigator.clipboard.writeText(consultaSQL);
    } catch {}
  };

  const handleGuardarResultado = () => {
    const blob = new Blob([resultado], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tabla_resultante.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExpandir = () => {
    setExpandido(true);
  };

  const handleEnviar = () => {
    if (!pregunta.trim()) return;
    setConsultaSQL("SELECT *\nFROM tabla_respuesta");
    setResultado("Resultado simulado de la consulta.");
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className={`${asideAbierto ? "w-64" : "w-16"} bg-[var(--aside)] flex flex-col p-4 gap-6 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          {asideAbierto && (
            <Link href="/" className="text-2xl font-bold text-[var(--logo-color)]">SQLChat</Link>
          )}
          <button onClick={() => setAsideAbierto(!asideAbierto)} className="text-[var(--logo-color)]">
            {asideAbierto ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        </div>

        {asideAbierto ? (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar"
                className="w-full px-2 py-1 rounded-md bg-[var(--card)] border border-[var(--secondary)] text-sm focus:outline-none"
              />
              <button className="text-[var(--logo-color)]">
                <FilePen size={16} />
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {bases.map((bd, i) => (
                <li key={i} className="hover:text-[var(--secondary)] cursor-pointer flex items-center gap-2">
                  <Database size={16} className="text-[var(--logo-color)]" /> {bd}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="space-y-4 text-sm pt-6">
            {bases.map((bd, i) => (
              <li key={i} className="relative group cursor-pointer flex justify-center">
                <Database size={20} className="text-[var(--logo-color)]" />
                <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-[var(--card)] text-xs text-[#5FCBCB] px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {bd}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <div className="w-full flex justify-between items-center px-8 py-4">
          {!asideAbierto && (
            <Link href="/" className="text-2xl font-bold text-[var(--logo-color)]">SQLChat</Link>
          )}
          <Header variant="main" />
        </div>

        <div className="flex flex-1 p-6 gap-6">
          <section className="w-1/2 flex flex-col gap-6">
            <div className="relative">
              <h3 className="text-[var(--secondary)] font-semibold mb-1">Pregunta</h3>
              <div className="relative">
                <textarea
                  placeholder="Escribe lo que quieras realizar en español"
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  className="w-full h-32 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 pr-10 resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                />
                <div className="absolute top-2 right-4 flex gap-2">
                  <button
                    onClick={handlePegar}
                    className="text-[var(--secondary)] hover:text-white relative group transition"
                  >
                    <ClipboardPaste size={18} />
                    <span className="absolute -top-7 right-0 bg-[var(--card)] text-xs text-[var(--foreground)] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Pegar texto
                    </span>
                  </button>
                </div>
                <div className="absolute bottom-2 right-4">
                  <button
                    onClick={handleEnviar}
                    className="text-[var(--secondary)] hover:text-white relative group transition"
                  >
                    <Send size={18} />
                    <span className="absolute -bottom-7 right-0 bg-[var(--card)] text-xs text-[var(--foreground)] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Enviar
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <h3 className="text-[var(--secondary)] font-semibold mb-1">Consulta generada</h3>
              <div className="relative">
                <textarea
                  value={consultaSQL}
                  readOnly
                  className="w-full h-24 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 pr-10 resize-none overflow-auto"
                />
                <div className="absolute top-2 right-4">
                  <button
                    onClick={handleCopiarConsulta}
                    className="text-[var(--secondary)] hover:text-white relative group transition"
                  >
                    <Copy size={18} />
                    <span className="absolute -top-7 right-0 bg-[var(--card)] text-xs text-[var(--foreground)] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      Copiar consulta
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col">
            <div className="relative mb-1">
              <h3 className="text-[var(--secondary)] font-semibold">Tabla resultante</h3>
            </div>
            <div className="relative flex-1 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 overflow-auto">
              <div className="absolute top-2 right-4 flex gap-2">
                <button
                  onClick={handleGuardarResultado}
                  className="text-[var(--secondary)] hover:text-white relative group transition"
                >
                  <Download size={18} />
                  <span className="absolute -top-7 right-0 bg-[var(--card)] text-xs text-[var(--foreground)] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Guardar tabla
                  </span>
                </button>
                <button
                  onClick={handleExpandir}
                  className="text-[var(--secondary)] hover:text-white relative group transition"
                >
                  <Maximize2 size={18} />
                  <span className="absolute -top-7 right-0 bg-[var(--card)] text-xs text-[var(--foreground)] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Expandir
                  </span>
                </button>
              </div>
              <pre className="text-sm">{resultado || "Sin datos..."}</pre>
            </div>
          </section>
        </div>

        <p className="text-xs text-[var(--secondary)] mt-2 text-center">
          Si realizas cambio, recuerda antes de aceptar los cambios revisar la tabla resultante.
        </p>
      </div>

      {expandido && (
        <div
          className="fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-10"
          onClick={() => setExpandido(false)}
        >
          <div
            className="relative bg-[var(--card)] text-[var(--foreground)] p-6 rounded-xl w-full h-full overflow-auto border border-[var(--secondary)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandido(false)}
              className="absolute top-4 right-4 text-[var(--secondary)] hover:text-white transition"
            >
              <X size={22} />
            </button>
            <pre className="whitespace-pre-wrap text-sm mt-8">{resultado || "Sin datos..."}</pre>
          </div>
        </div>
      )}
    </div>
  );
}