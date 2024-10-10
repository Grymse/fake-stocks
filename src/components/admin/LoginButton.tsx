import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { signinWithGoogle, signout } from "@/lib/firebase";

export default function LoginButton() {
  const user = useAuth();

  if (user) {
    return (
      <Button variant="secondary" onClick={signout}>
        Sign out
      </Button>
    );
  }

  return <Button onClick={signinWithGoogle}>Sign in</Button>;
}
