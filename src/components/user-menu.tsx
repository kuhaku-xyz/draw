"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount } from "@/contexts/account-context";
import { resolveUrl } from "@/lib/resolve-url";
import { Brush, LogOutIcon, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLensClient } from "@/lib/lens/client";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { Login } from "./login";
import { Button } from "./ui/button";

export default function UserMenu() {
  const { account, loading } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { data: user } = useAuthenticatedUser()

  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />;
  }

  if (!user || !account) {
    return <Login />
  }

  const pictureUrl = resolveUrl(account.metadata?.picture)
  const displayName = account.metadata?.name || account.username?.localName || account.address.substring(0, 6);

  const handleLogout = async () => {
    const client = await getLensClient();
    if (client.isSessionClient()) {
      await client.logout();
    }

    disconnect();
    router.push("/");
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex rounded-full items-center justify-center gap-2 w-10 h-10 outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={pictureUrl || undefined} />
            <AvatarFallback>{account.address.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-lg">
        <DropdownMenuItem asChild>
          <Link href="/sketches" className="flex items-center cursor-pointer">
            <Brush className="mr-2 h-4 w-4" />
            <span>My Art</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="">
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 