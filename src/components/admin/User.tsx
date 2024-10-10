import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function toInitials(name: string | null | undefined) {
  if (!name) return "??";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function User() {
  const user = useAuth();
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={user?.photoURL ?? undefined}
          alt={user?.displayName ?? "None"}
        />
        <AvatarFallback>{toInitials(user?.displayName)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">{user?.displayName}</p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
}
