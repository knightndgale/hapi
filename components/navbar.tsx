"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { logout } from "@/requests/auth.request";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { getGuests } from "@/requests/guest.request";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        localStorage.removeItem("user");
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error(response.message || "Logout failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleGetGuests = async () => {
    try {
      const response = await getGuests();
      if (!response.success) {
        // If the request fails due to authentication, redirect to login
        if (response.message?.includes("authentication")) {
          localStorage.removeItem("user");
          setUser(null);
          toast.error("Your session has expired. Please log in again.");
          router.push("/login");
          return;
        }
        toast.error(response.message || "Failed to get guests");
        return;
      }
      console.log(response.data);
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
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          ) : user ? (
            <>
              <Button variant="ghost" className="font-medium" onClick={handleGetGuests}>
                Get Guest Test
              </Button>
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
