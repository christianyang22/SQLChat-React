"use client";

import Header from "@/app/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const esMayorDeEdad = birthDate ? calcularEdad(birthDate) >= 18 : false;

  const reglas = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    numero: /\d/.test(password),
    especial: /[^a-zA-Z0-9]/.test(password),
    coinciden: password === confirmPass && confirmPass.length > 0,
    mayorEdad: esMayorDeEdad,
  };

  const formularioValido =
    Object.values(reglas).every((v) => v) && nombre && apellido && email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;
    try {
      // 1) Llamada al register
      const res = await api.post<{ token: string; user: any }>(
        "/auth/register",
        { nombre, apellido, birthDate, email, password }
      );
      // 2) Guardamos el token CORRECTAMENTE
      localStorage.setItem("token", res.token);
      router.push("/main");
    } catch (err: any) {
      setError(err.message || "Error al registrar");
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
        <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
        <p className="text-lg">Regístrate para empezar a usar SQLChat</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-sm text-left"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="input"
            required
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input"
            required
          />
          {!esMayorDeEdad && birthDate && (
            <p className="text-sm text-red-400">Debes tener al menos 18 años</p>
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          {password.length > 0 && (
            <div className="text-sm space-y-1">
              <p className={reglas.longitud ? "text-green-400" : "text-red-400"}>
                • Mínimo 8 caracteres
              </p>
              <p className={reglas.mayuscula ? "text-green-400" : "text-red-400"}>
                • Una letra mayúscula
              </p>
              <p className={reglas.numero ? "text-green-400" : "text-red-400"}>
                • Un número
              </p>
              <p className={reglas.especial ? "text-green-400" : "text-red-400"}>
                • Un carácter especial
              </p>
            </div>
          )}
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="input"
            required
          />
          {!reglas.coinciden && confirmPass && (
            <p className="text-sm text-red-400">Las contraseñas no coinciden</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!formularioValido}
            className={`mt-2 font-semibold py-2 rounded-xl transition ${
              formularioValido
                ? "bg-[var(--secondary)] text-black hover:bg-[#4db4b4] hover:text-white"
                : "bg-gray-600 text-white cursor-not-allowed"
            }`}
          >
            Registrarse
          </button>
          <p className="text-center text-sm mt-2">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-[var(--secondary)] hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}