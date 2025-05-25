import { useState, useEffect } from "react";

export function useAuth() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  return { isLogged };
}