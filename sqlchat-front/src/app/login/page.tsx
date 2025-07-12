"use client";

import Header from "@/app/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setToken } = useAuth();

  const formularioValido = email.length > 0 && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;
    try {
      const res = await api.post<{ token: string; user: any }>(
        "/auth/login",
        { email, password }
      );
      setToken(res.token);
      router.push("/main");
    } catch (err: any) {
      setError("Correo electronico o contraseña errónea");
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-3xl font-bold">Inicia sesión</h1>
        <p className="text-lg">Accede a tu cuenta de SQLChat</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-sm text-left"
          autoComplete="on"
        >
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-[var(--foreground)] text-sm font-semibold pointer-events-none select-none"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-[var(--secondary)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] transition cursor-pointer"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-[var(--foreground)] text-sm font-semibold pointer-events-none select-none"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-[var(--secondary)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] transition cursor-pointer"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="min-h-[24px] flex items-center justify-center">
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!formularioValido}
            className={`mt-2 font-semibold py-2 rounded-xl transition w-full
              ${formularioValido
                ? "bg-[var(--secondary)] text-black hover:bg-[#4db4b4] hover:text-white cursor-pointer"
                : "bg-gray-600 text-white cursor-not-allowed"
              }`}
          >
            Iniciar sesión
          </button>
          <p className="text-center text-sm mt-2">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-[var(--secondary)] hover:underline cursor-pointer transition"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}