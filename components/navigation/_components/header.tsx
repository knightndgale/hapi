"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logout } from "@/requests/auth.request";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { User } from "@/types/schema/User.schema";

export function Header({ user }: { user?: User }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error(response.message || "Logout failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6" />
          <span className="font-bold">Hapí</span>
        </Link>
        <section className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="font-medium">
                    {user.first_name}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </section>
      </div>
    </nav>
  );
}
