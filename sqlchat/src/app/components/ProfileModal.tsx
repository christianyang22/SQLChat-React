"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ProfileModal() {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleModal = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white font-semibold bg-[#5FCBCB] px-4 py-2 rounded-lg hover:bg-[#4db4b4] transition"
      >
        Perfil
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-[#2c2c2c] p-6 rounded-xl shadow-xl w-72 animate-fadeIn"
          >
            <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left text-white hover:text-[#5FCBCB]">
                  Ajustes
                </button>
              </li>
              <li>
                <Link
                  href="/login"
                  className="block w-full text-left text-white hover:text-red-400"
                >
                  Cerrar sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}