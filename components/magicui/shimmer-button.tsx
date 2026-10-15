"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.08em",
      shimmerDuration = "2.5s",
      borderRadius = "14px",
      background = "radial-gradient(ellipse 80% 50% at 50% 120%, rgba(245, 158, 11, 0.4), rgba(18, 18, 18, 0.95))",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-amber-500/30 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition-all duration-300",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer container */}
        <div className="absolute inset-0 overflow-visible [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-[spin_3s_linear_infinite] motion-reduce:hidden [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-[shimmer-slide_var(--speed)_ease-in-out_infinite_alternate] absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_0deg,transparent_0_340deg,var(--shimmer-color)_360deg)] [translate:0_0]" />
          </div>
        </div>

        {/* Backdrop filter */}
        <div className="absolute [inset:var(--cut)] -z-10 [border-radius:var(--radius)] [background:var(--bg)]" />

        {/* Conteúdo */}
        <span className="relative z-10 flex items-center gap-2 font-semibold text-sm">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
