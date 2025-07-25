"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/Asset 1.png";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).position;
    const scrollY = window.scrollY;

    if (isMenuOpen) {
      document.body.classList.add("menu-open");
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    return () => {
      if (isMenuOpen) {
        document.body.classList.remove("menu-open");
        document.body.style.position = originalStyle;
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      }
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/dongeng", label: "Dongeng", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <nav className="container max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex gap-3 lg:gap-4 items-center">
              <Image src={logo} width={40} height={40} alt="Logo" />
              <h1 className="text-2xl font-bold text-foreground">Nusakatha</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "default" : "ghost"}
                  className="transition-gentle flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(true)}
              variant="ghost"
              size="icon"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background/80 backdrop-blur-lg p-6 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            onClick={() => setIsMenuOpen(false)}
            variant="ghost"
            size="icon"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col space-y-3 ">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant={isActive(link.href) ? "secondary" : "secondary"}
                className="w-full justify-start flex items-center gap-3 text-md"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
