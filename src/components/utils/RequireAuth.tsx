import useAuth from "@/hooks/useAuth";
import React from "react";
import { Button } from "../ui/button";
import { signinWithGoogle } from "@/lib/firebase";

type Variants =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  | null
  | undefined;

type Props = { children: React.ReactNode; message: string; variant?: Variants };

export default function RequireAuth({ children, message, variant }: Props) {
  const user = useAuth();

  if (!user) {
    return (
      <Button variant={variant} onClick={signinWithGoogle}>
        {message}
      </Button>
    );
  }

  return children;
}
