"use client";

import Header from "../components/header";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const formularioValido = email.length > 0 && password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;
    router.push("/main");
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header variant="login" />
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-3xl font-bold">Inicia sesión</h1>
        <p className="text-lg">Accede a tu cuenta de SQLChat</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm text-left">
          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!formularioValido}
            className={`mt-2 font-semibold py-2 rounded-xl transition ${
              formularioValido
                ? "bg-[#5FCBCB] text-black hover:bg-[#4db4b4] hover:text-white"
                : "bg-gray-600 text-white cursor-not-allowed"
            }`}
          >
            Iniciar sesión
          </button>

          <p className="text-center text-sm text-white mt-2">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-[#5FCBCB] hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
