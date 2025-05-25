"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ConfigPopup from "./ConfigPopup";
import api from "@/utils/api";
import { useAuth } from "@/app/hooks/useAuth";

type Props = {
  showBurger?: boolean;
  onBurgerClick?: () => void;
};

export default function Header({ showBurger = false, onBurgerClick }: Props) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isLogged } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener("mousedown", outside);
    return () => window.removeEventListener("mousedown", outside);
  }, [open]);

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          {showBurger ? (
            <button onClick={onBurgerClick} className="text-2xl"></button>
          ) : (
            <Link
              href="/"
              className="flex items-center text-2xl font-bold text-[var(--logo-color)]"
            >
              <Image
                src="/sqlchat.png"
                alt="SQLChat Logo"
                width={48}
                height={48}
                className="mr-2 w-15 h-15"
              />
              SQLChat
            </Link>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          {isLogged ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 border border-[var(--secondary)] rounded-md text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-black transition"
              >
                Perfil
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--card)] border border-[var(--secondary)] rounded-md shadow-lg z-20">
                  <ul className="py-1 text-sm">
                    <li
                      onClick={() => {
                        setShowModal(true);
                        setOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-[var(--aside)] hover:text-[var(--secondary)] cursor-pointer transition"
                    >
                      Configuración
                    </li>
                    <li
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-2 hover:bg-[var(--aside)] hover:text-[var(--secondary)] cursor-pointer transition"
                    >
                      Cerrar sesión
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 border border-[var(--secondary)] rounded-md text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-black transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 border border-[var(--secondary)] rounded-md text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-black transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </header>
      {showModal && <ConfigPopup onClose={() => setShowModal(false)} />}
    </>
  );
}