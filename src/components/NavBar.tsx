"use client";

import { MonitorPlay } from "lucide-react";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MonitorPlay className="w-8 h-8 text-vibrant-teal" />
          <span className="font-athletic text-3xl tracking-wide text-highlighter-yellow mt-1">
            VAR-Cade
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-athletic text-xl text-neon-purple mt-1">
            World Cup 26
          </span>
        </div>
      </div>
    </nav>
  );
}
