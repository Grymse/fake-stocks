import useAuth from "@/hooks/useAuth";
import { Button } from "../../ui/button";
import { signinWithGoogle, signout } from "@/lib/firebase";
import { SimpleTooltip } from "@/components/ui/tooltip";

export default function LoginButton() {
  const user = useAuth();

  if (user) {
    return (
      <SimpleTooltip message={"Sign out from account"} asChild>
        <Button variant="secondary" onClick={signout}>
          Sign out
        </Button>
      </SimpleTooltip>
    );
  }

  return (
    <SimpleTooltip
      message={"Sign in to Google Account to save/load stocks"}
      asChild
    >
      <Button onClick={signinWithGoogle}>Sign in</Button>
    </SimpleTooltip>
  );
}
