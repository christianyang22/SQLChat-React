import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DatabaseProvider } from "@/context/DatabaseContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SQLChat",
  description: "Chat de lenguaje natural para bases de datos SQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LocaleProvider>
            <DatabaseProvider>
              <main>{children}</main>
            </DatabaseProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}