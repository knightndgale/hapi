import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToastSonner } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hapí - Manage Your Events",
  description: "Create and manage events with QR code check-in",
};

/**
 * Root layout component that sets up global providers, theming, and notification toasters for the application.
 *
 * Wraps all page content with the Inter font, system-based theme support, and notification components.
 *
 * @param children - The content to render within the layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <ToastSonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
