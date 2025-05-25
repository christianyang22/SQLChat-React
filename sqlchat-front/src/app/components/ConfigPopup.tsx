"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useLocale, Lang } from "@/context/LocaleContext";
import { useT } from "@/lib/t";
import { useTheme } from "@/context/ThemeContext";
import api from "@/utils/api";

type Props = { onClose: () => void };

export default function ConfigPopup({ onClose }: Props) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<"perfil" | "preferencias">("perfil");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passAct, setPassAct] = useState("");
  const [passNew, setPassNew] = useState("");

  const [notifications, setNotifications] = useState(false);

  const { lang, setLang } = useLocale();
  const { dark, toggle } = useTheme();
  const [darkTheme, setDarkTheme] = useState<boolean>(dark);

  const t = useT();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) =>
      popupRef.current && !popupRef.current.contains(e.target as Node) && onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const u = await api.get<{ first_name: string; last_name: string; email: string }>(
          "/users/me",
        );
        setFirstName(u.first_name ?? "");
        setLastName(u.last_name ?? "");
        setEmail(u.email ?? "");

        const p = await api.get<{
          notifications: boolean;
          dark_theme: boolean | null;
          language: Lang;
        }>("/users/preferences");

        setNotifications(!!p.notifications);

        const preferredDark = p.dark_theme ?? dark;
        setDarkTheme(preferredDark);
        if (preferredDark !== dark) toggle(preferredDark);

        setLang(p.language);
      } catch {
      }
    })();
  }, []);

  const onDarkToggle = async (checked: boolean) => {
    setDarkTheme(checked);
    toggle(checked);

    try {
      await api.put("/users/preferences", { dark_theme: checked });
    } catch (e) {
      console.error(e);
    }
  };

  const guardar = async () => {
    try {
      await api.put("/users/me", {
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(email && { email }),
        ...(passAct && passNew ? { passAct, passNew } : {}),
      });
      await api.put("/users/preferences", {
        notifications,
        language: lang,
        dark_theme: darkTheme,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div ref={popupRef} className="bg-[var(--background)] w-[800px] rounded-md">
        <aside className="flex justify-around border-b border-[var(--secondary)]">
          <ul className="flex gap-6 px-6 py-4 text-sm font-medium text-gray-600">
            <li
              className={section === "perfil" ? "text-teal-400 font-semibold" : ""}
              onClick={() => setSection("perfil")}
            >
              {t.userProfile}
            </li>
            <li
              className={section === "preferencias" ? "text-teal-400 font-semibold" : ""}
              onClick={() => setSection("preferencias")}
            >
              {t.preferences}
            </li>
          </ul>
        </aside>

        <section className="w-2/3 p-6 space-y-6 mx-auto">
          {section === "perfil" && (
            <>
              <h3 className="text-lg font-semibold text-teal-400">{t.userProfile}</h3>
              <div className="space-y-4">
                <input
                  placeholder="Nombre"
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  placeholder="Apellido"
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  placeholder="Correo electrónico"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <h3 className="text-lg font-semibold text-teal-400">{t.changePassword}</h3>
                <input
                  type="password"
                  placeholder={t.currentPassword}
                  className="input"
                  value={passAct}
                  onChange={(e) => setPassAct(e.target.value)}
                />
                <input
                  type="password"
                  placeholder={t.newPassword}
                  className="input"
                  value={passNew}
                  onChange={(e) => setPassNew(e.target.value)}
                />
              </div>
            </>
          )}

          {section === "preferencias" && (
            <>
              <h3 className="text-lg font-semibold text-teal-400">{t.preferences}</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  {t.notifications}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={darkTheme}
                    onChange={(e) => onDarkToggle(e.target.checked)}
                  />
                  {t.darkTheme}
                </label>
                <div className="flex flex-col">
                  <label className="mb-1">{t.language}</label>
                  <select
                    className="input"
                    value={lang}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setLang(e.target.value as Lang)
                    }
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button onClick={guardar} className="px-4 py-2 bg-teal-400 text-black rounded-md">
              {t.save}
            </button>
            <button onClick={onClose} className="px-4 py-2 border border-teal-400 rounded-md">
              {t.close}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}