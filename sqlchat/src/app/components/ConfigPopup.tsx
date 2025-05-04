"use client";

import { useEffect, useState } from "react";

type ConfigPopupProps = {
  onClose: () => void;
};

export default function ConfigPopup({ onClose }: ConfigPopupProps) {
  const [seccionActiva, setSeccionActiva] = useState<"perfil" | "preferencias">("perfil");
  const [nombre, setNombre] = useState("Christian Jonathan");
  const [correo, setCorreo] = useState("usuario@email.com");
  const [contrasena, setContrasena] = useState("");
  const [notificaciones, setNotificaciones] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true);
  const [idioma, setIdioma] = useState("Español");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleGuardar = () => {
    localStorage.setItem("temaOscuro", JSON.stringify(temaOscuro));
    const html = document.documentElement;
    if (temaOscuro) {
      html.classList.add("theme-dark");
      html.classList.remove("theme-light");
    } else {
      html.classList.add("theme-light");
      html.classList.remove("theme-dark");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#2c2c2c] border border-[#5FCBCB] rounded-xl w-full max-w-4xl p-0 text-white shadow-lg flex overflow-hidden">
        <aside className="w-1/3 bg-[#1f1f1f] border-r border-[#5FCBCB] p-4">
          <h2 className="text-xl font-bold text-[#5FCBCB] mb-6">Configuración</h2>
          <ul className="space-y-4 text-sm">
            <li
              className={`cursor-pointer ${seccionActiva === "perfil" ? "text-[#5FCBCB] font-semibold" : "text-white"}`}
              onClick={() => setSeccionActiva("perfil")}
            >
              Perfil de usuario
            </li>
            <li
              className={`cursor-pointer ${seccionActiva === "preferencias" ? "text-[#5FCBCB] font-semibold" : "text-white"}`}
              onClick={() => setSeccionActiva("preferencias")}
            >
              Preferencias
            </li>
          </ul>
        </aside>

        <section className="w-2/3 p-6 space-y-6">
          {seccionActiva === "perfil" ? (
            <>
              <h3 className="text-lg font-semibold text-[#5FCBCB]">Información del perfil</h3>
              <div className="space-y-6">
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#2c2c2c] px-1 text-white text-sm font-semibold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#2c2c2c] px-1 text-white text-sm font-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[#2c2c2c] px-1 text-white text-sm font-semibold">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-[#5FCBCB]">Preferencias</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span>Notificaciones</span>
                  <input
                    type="checkbox"
                    checked={notificaciones}
                    onChange={() => setNotificaciones(!notificaciones)}
                    className="accent-[#5FCBCB] scale-125"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Tema oscuro</span>
                  <input
                    type="checkbox"
                    checked={temaOscuro}
                    onChange={() => setTemaOscuro(!temaOscuro)}
                    className="accent-[#5FCBCB] scale-125"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Idioma</span>
                  <select
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                    className="bg-[#2c2c2c] border border-[#5FCBCB] rounded-md px-2 py-1 text-white"
                  >
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-[#5FCBCB] text-black font-semibold rounded-md hover:bg-[#4db4b4] hover:text-white transition"
            >
              Guardar cambios
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#5FCBCB] text-white font-semibold rounded-md hover:bg-[#3a3a3a] transition"
            >
              Cerrar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}