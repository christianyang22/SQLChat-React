import Header from "./components/header";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header variant="main" />
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-4xl font-bold">Bienvenido a SQLChat</h1>
        <p className="text-lg">¿Quieres empezar a usarlo?</p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 border border-[var(--logo-color)] text-[var(--logo-color)] font-semibold rounded-md hover:bg-[var(--logo-color)] hover:text-black transition"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 border border-[var(--logo-color)] text-[var(--logo-color)] font-semibold rounded-md hover:bg-[var(--logo-color)] hover:text-black transition"
          >
            Regístrate
          </Link>
        </div>
      </section>
    </main>
  );
}