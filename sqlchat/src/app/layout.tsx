import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQLChat",
  description: "Chat de lenguaje natural para bases de datos SQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const tema = JSON.parse(localStorage.getItem("temaOscuro"));
                  const clase = tema === false ? "theme-light" : "theme-dark";
                  document.documentElement.classList.add(clase);
                } catch {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}