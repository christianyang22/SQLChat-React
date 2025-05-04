"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ConfigPopup from "./ConfigPopup";

type HeaderProps = {
  variant: "main" | "login" | "register";
};

export default function Header({ variant }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };

    if (menuAbierto) {
      document.addEventListener("mousedown", handleClickFuera);
    } else {
      document.removeEventListener("mousedown", handleClickFuera);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
    };
  }, [menuAbierto]);

  return (
    <>
      <header className="w-full flex justify-end items-center px-8 py-4">
        {variant === "main" ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="px-4 py-2 bg-[var(--logo-color)] text-black font-semibold rounded-md shadow-md hover:bg-[#4db4b4] hover:text-white transition"
            >
              Perfil
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-40 bg-[#2c2c2c] text-white rounded-md shadow-lg border border-[#5FCBCB] z-10">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer"
                    onClick={() => {
                      setMostrarModal(true);
                      setMenuAbierto(false);
                    }}
                  >
                    Configuración
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer"
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Cerrar sesión
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : variant === "login" ? (
          <Link
            href="/register"
            className="px-4 py-2 bg-[var(--logo-color)] text-black font-semibold rounded-md shadow-md hover:bg-[#4db4b4] hover:text-white transition"
          >
            Regístrate
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-[var(--logo-color)] text-black font-semibold rounded-md shadow-md hover:bg-[#4db4b4] hover:text-white transition"
          >
            Iniciar sesión
          </Link>
        )}
      </header>

      {mostrarModal && <ConfigPopup onClose={() => setMostrarModal(false)} />}
    </>
  );
}