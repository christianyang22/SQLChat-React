"use client";

import { useEffect, useRef, useState } from "react";

type ConfigPopupProps = {
  onClose: () => void;
};

export default function ConfigPopup({ onClose }: ConfigPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const [seccionActiva, setSeccionActiva] = useState<"perfil" | "preferencias">("perfil");
  const [nombre, setNombre] = useState("Christian Jonathan");
  const [correo, setCorreo] = useState("usuario@email.com");
  const [notificaciones, setNotificaciones] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true);
  const [idioma, setIdioma] = useState("Español");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("temaOscuro");
    if (saved !== null) {
      const isDark = JSON.parse(saved);
      setTemaOscuro(isDark);
      applyTheme(isDark);
    } else {
      applyTheme(true);
      setTemaOscuro(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--background", "#1e1e1e");
      root.style.setProperty("--header-bg", "#2c2c2c");
      root.style.setProperty("--aside", "#2c2c2c");
      root.style.setProperty("--card", "#333333");
      root.style.setProperty("--foreground", "#ffffff");
    } else {
      root.style.setProperty("--background", "#f5f5f5");
      root.style.setProperty("--header-bg", "#ffffff");
      root.style.setProperty("--aside", "#e4e4e4");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--foreground", "#1e1e1e");
    }
  };

  const handleGuardar = () => {
    localStorage.setItem("temaOscuro", JSON.stringify(temaOscuro));
    applyTheme(temaOscuro);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div ref={popupRef} className="bg-[var(--card)] border border-[#5FCBCB] rounded-xl w-full max-w-4xl p-0 text-[var(--foreground)] shadow-lg flex overflow-hidden">
        <aside className="w-1/3 bg-[var(--aside)] border-r border-[#5FCBCB] p-4">
          <h2 className="text-xl font-bold text-[#5FCBCB] mb-6">Configuración</h2>
          <ul className="space-y-4 text-sm">
            <li
              className={`cursor-pointer ${seccionActiva === "perfil" ? "text-[#5FCBCB] font-semibold" : "text-[var(--foreground)]"}`}
              onClick={() => setSeccionActiva("perfil")}
            >
              Perfil de usuario
            </li>
            <li
              className={`cursor-pointer ${seccionActiva === "preferencias" ? "text-[#5FCBCB] font-semibold" : "text-[var(--foreground)]"}`}
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
                  <label className="absolute -top-3 left-3 bg-[var(--card)] px-1 text-[var(--foreground)] text-sm font-semibold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-3 left-3 bg-[var(--card)] px-1 text-[var(--foreground)] text-sm font-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#5FCBCB]">Cambiar contraseña</h3>
                <div className="space-y-6">
                  <div className="relative">
                    <label className="absolute -top-3 left-3 bg-[var(--card)] px-1 text-[var(--foreground)] text-sm font-semibold">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={contrasenaActual}
                      onChange={(e) => setContrasenaActual(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-3 left-3 bg-[var(--card)] px-1 text-[var(--foreground)] text-sm font-semibold">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-3 left-3 bg-[var(--card)] px-1 text-[var(--foreground)] text-sm font-semibold">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmarContrasena}
                      onChange={(e) => setConfirmarContrasena(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
                    />
                  </div>
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
                    className="bg-[var(--card)] border border-[#5FCBCB] rounded-md px-2 py-1 text-[var(--foreground)]"
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
              className="px-4 py-2 border border-[#5FCBCB] text-[var(--foreground)] font-semibold rounded-md hover:bg-[#3a3a3a] transition"
            >
              Cerrar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}