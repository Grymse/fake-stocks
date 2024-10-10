import { Loading } from "@/components/ui/loading";
import Null from "@/components/ui/null";
import { useState } from "react";

export default function useLoader() {
  const [isLoading, setLoading] = useState(false);

  return {
    isLoading,
    setLoading,
    Loading: isLoading ? Loading : Null,
  };
}
