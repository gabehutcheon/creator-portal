"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  borderGradient?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.15)",
  glowSize = 600,
  borderGradient,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("glow-card group relative", className)}
      style={
        {
          "--glow-x": `${position.x}px`,
          "--glow-y": `${position.y}px`,
          "--glow-color": glowColor,
          "--glow-size": `${glowSize}px`,
          "--glow-opacity": isHovered ? "1" : "0",
          ...(borderGradient ? { "--border-gradient": borderGradient } : {}),
        } as React.CSSProperties
      }
    >
      {/* External glow bleed — the luminous spill outside the card */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize * 0.8}px circle at var(--glow-x) var(--glow-y), ${glowColor}, transparent 60%)`,
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      {/* Gradient border overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(${glowSize * 0.6}px circle at var(--glow-x) var(--glow-y), ${glowColor.replace(/[\d.]+\)$/, "0.3)")}, transparent 50%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          zIndex: 1,
        }}
      />

      {/* Card surface */}
      <div
        className="relative z-10 rounded-[inherit] bg-[var(--surface-elevated)] border border-[var(--border-default)] transition-all duration-300 group-hover:border-[var(--border-hover)]"
        style={borderGradient ? { borderImage: borderGradient, borderImageSlice: 1 } : undefined}
      >
        {/* Internal glow — subtle brightness near cursor */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${glowSize * 0.4}px circle at var(--glow-x) var(--glow-y), ${glowColor.replace(/[\d.]+\)$/, "0.06)")}, transparent 50%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

/* Premium stat card variant — dark cards with subtle left-edge color accent */
interface GradientStatCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  borderColor?: string;
  accentColor?: string; // e.g. "rgba(139, 92, 246, 0.6)" for the left edge glow
}

export function GradientStatCard({
  children,
  className,
  accentColor = "rgba(255, 255, 255, 0.1)",
}: GradientStatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[var(--border-default)] bg-[#0d0d0d] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] group",
        className,
      )}
    >
      {/* Subtle left-edge accent glow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: accentColor }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none opacity-40"
        style={{
          background: `linear-gradient(to right, ${accentColor}, transparent)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
