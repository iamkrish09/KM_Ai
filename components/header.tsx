"use client";

import { useState } from "react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import Link from "next/link";
import LoginModal from "@/components/LoginModal";

export function Header() {
  const [openModal, setOpenModal] = useState(false);

  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "Pricing", href: "#pricing-section" },
    { name: "Testimonials", href: "#testimonials-section" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-foreground text-xl font-semibold">KharchaMind</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">AI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-[#888888] hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Login Button */}
          <Button
            className="hidden md:block bg-black text-white px-6 py-2 rounded-full font-medium shadow-sm"
            onClick={() => setOpenModal(true)}
          >
            Login
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="bg-background border-t border-border text-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-[#888888] hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Login Button */}
                <Button
                  className="w-full bg-black text-white px-6 py-2 rounded-full font-medium shadow-sm mt-4"
                  onClick={() => setOpenModal(true)}
                >
                  Login
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal open={openModal} onClose={() => setOpenModal(false)} />
    </header>
  );
}
