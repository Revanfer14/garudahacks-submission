"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, List } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <nav className="container max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-earth rounded-xl shadow-warm transition-all duration-300 group-hover:scale-105">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Nusantara Stories
              </h1>
              <p className="text-sm text-muted-foreground">Dongeng Indonesia</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="transition-gentle"
              >
                <Home className="h-4 w-4" />
                <span>Beranda</span>
              </Button>
            </Link>

            <Link href="/dongeng" className="flex items-center space-x-2">
              <Button
                variant={isActive("/dongeng") ? "default" : "ghost"}
                className="transition-gentle"
              >
                <List className="h-4 w-4" />
                <span>Dongeng</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
