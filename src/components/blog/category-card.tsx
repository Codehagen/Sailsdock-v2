"use client";

import Link from "next/link";
import { useMotionValue } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: number | string;
  y?: number | string;
  squares?: [number, number][];
  className?: string;
}) {
  let patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
}: {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className
      )}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;

        return (
          <div
            key={i}
            className={`absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border [--i:${i}]`}
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: `hsl(var(--foreground), ${borderOpacity / 100})`,
                bottom: "-50%",
                right: "-50%",
                transform: "translate(50%, 50%) scale(0)",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

function CardPattern({
  mouseX,
  mouseY,
  ...gridProps
}: {
  mouseX: any;
  mouseY: any;
  [key: string]: any;
}) {
  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5"
          {...gridProps}
        />
      </div>
      <Ripple
        className="[mask-image:radial-gradient(circle_at_bottom_right,white,transparent)]"
        mainCircleSize={150}
        numCircles={5}
      />
    </div>
  );
}

export default function CategoryCard({
  href,
  name,
  description,
  icon,
  pattern,
}: {
  href: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pattern: {
    y: number;
    squares: [number, number][];
  };
}) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      key={href}
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-gray-50 transition-shadow hover:shadow-md hover:shadow-gray-900/5"
    >
      <CardPattern {...pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-200 group-hover:ring-gray-900/10" />
      <div className="relative rounded-2xl p-6 pt-16">
        {icon}
        <h3 className="mt-4 font-semibold leading-7 text-gray-900">
          <Link href={href}>
            <span className="absolute inset-0 rounded-2xl" />
            {name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
