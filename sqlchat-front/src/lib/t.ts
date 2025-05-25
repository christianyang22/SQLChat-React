import { useLocale } from "@/context/LocaleContext";

type Lang = "es" | "en";
type Dict = {
  [K in Lang]: {
    welcome: string;
    preferences: string;
    notifications: string;
    darkTheme: string;
    language: string;
    userProfile: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    save: string;
    close: string;
    question: string;
    generatedQuery: string;
    resultTable: string;
    paste: string;
    send: string;
    copy: string;
    expand: string;
    note: string;
    noData: string;
    placeholder: string;
    search: string;
    selectConnection: string;
    loading: string;
    deleteConfirm: string;
  };
};

const strings: Dict = {
  es: {
    welcome: "Bienvenido",
    preferences: "Preferencias",
    notifications: "Notificaciones",
    darkTheme: "Tema oscuro",
    language: "Idioma",
    userProfile: "Perfil de usuario",
    changePassword: "Cambiar contraseña",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    save: "Guardar",
    close: "Cerrar",
    question: "Pregunta",
    generatedQuery: "Consulta generada",
    resultTable: "Tabla resultante",
    paste: "Pegar",
    send: "Enviar",
    copy: "Copiar",
    expand: "Expandir",
    note: "Si realizas cambios, revisa la tabla resultante antes de aceptarlos.",
    noData: "Sin datos...",
    placeholder: "Escribe tu consulta",
    search: "Buscar",
    selectConnection: "Selecciona una conexión primero",
    loading: "Ejecutando consulta…",
    deleteConfirm: "¿Seguro que quieres borrar esta conexión?",
  },
  en: {
    welcome: "Welcome",
    preferences: "Preferences",
    notifications: "Notifications",
    darkTheme: "Dark theme",
    language: "Language",
    userProfile: "User profile",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    save: "Save",
    close: "Close",
    question: "Question",
    generatedQuery: "Generated query",
    resultTable: "Result table",
    paste: "Paste",
    send: "Send",
    copy: "Copy",
    expand: "Expand",
    note: "If you make changes, review the resulting table before accepting them.",
    noData: "No data...",
    placeholder: "Write your query",
    search: "Search",
    selectConnection: "Select a connection first",
    loading: "Running query…",
    deleteConfirm: "Are you sure you want to delete this connection?",
  },
};

export function useT() {
  const { lang } = useLocale();
  return strings[lang];
}