"use client";

import Header from "../components/header";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const esMayorDeEdad = birthDate ? calcularEdad(birthDate) >= 18 : true;

  const reglas = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
    especial: /[^a-zA-Z0-9]/.test(password),
    coinciden: password === confirmPass && confirmPass.length > 0,
    mayorEdad: esMayorDeEdad,
  };

  const formularioValido = Object.values(reglas).every((v) => v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header variant="register" />
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
        <p className="text-lg">Regístrate para empezar a usar SQLChat</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm text-left">
          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Apellido
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
            {!esMayorDeEdad && (
              <p className="text-sm text-red-400 mt-1">Debes tener al menos 18 años</p>
            )}
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Correo electrónico
            </label>
            <input
              type="email"
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

          {password.length > 0 && (
            <div className="text-sm text-white space-y-1">
              <p className={reglas.longitud ? "text-green-400" : "text-red-400"}>• Mínimo 8 caracteres</p>
              <p className={reglas.mayuscula ? "text-green-400" : "text-red-400"}>• Una letra mayúscula</p>
              <p className={reglas.numero ? "text-green-400" : "text-red-400"}>• Un número</p>
              <p className={reglas.especial ? "text-green-400" : "text-red-400"}>• Un carácter especial</p>
            </div>
          )}

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-[var(--background)] px-1 text-white text-sm font-semibold">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#5FCBCB] bg-[var(--background)] text-white focus:outline-none focus:ring-2 focus:ring-[#5FCBCB]"
              required
            />
            {!reglas.coinciden && confirmPass && (
              <p className="text-sm text-red-400 mt-1">Las contraseñas no coinciden</p>
            )}
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
            Registrarse
          </button>

          <p className="text-center text-sm text-white mt-2">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#5FCBCB] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
