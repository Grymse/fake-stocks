import { useRef } from "react";

export function useFlags() {
  const debug = useRef(window.location.search.includes("debug=true")).current;
  const fake = useRef(window.location.search.includes("fake=true")).current;

  return { debug, fake };
}
