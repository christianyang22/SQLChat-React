"use client";

import Header from "../components/header";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FilePen, Database, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function MainPage() {
  const [pregunta, setPregunta] = useState("");
  const [consultaSQL, setConsultaSQL] = useState("SELECT *\nFROM BBDD");
  const [resultado, setResultado] = useState("");
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
            <div>
              <h3 className="text-[var(--secondary)] font-semibold mb-1">Pregunta</h3>
              <textarea
                placeholder="Escribe lo que quieras realizar en español"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full h-32 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              />
            </div>

            <div>
              <h3 className="text-[var(--secondary)] font-semibold mb-1">Consulta generada</h3>
              <textarea
                value={consultaSQL}
                readOnly
                className="w-full h-24 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 resize-none"
              />
            </div>
          </section>

          <section className="flex-1 flex flex-col">
            <h3 className="text-[var(--secondary)] font-semibold mb-1">Tabla resultante</h3>
            <div className="flex-1 bg-[var(--card)] border border-[var(--secondary)] rounded-lg p-3 overflow-auto">
              <pre className="text-sm">{resultado || "Sin datos..."}</pre>
            </div>
            <p className="text-xs text-[var(--secondary)] mt-2">
              Si realizas cambio, recuerda antes de aceptar los cambios revisar la tabla resultante.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}