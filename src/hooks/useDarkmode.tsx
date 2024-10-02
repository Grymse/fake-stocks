import { useEffect } from "react";

export const useDarkmode = () => {
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.add("dark");
  }, []);

  return null;
};
