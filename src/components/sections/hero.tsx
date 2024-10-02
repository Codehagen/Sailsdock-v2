"use client";

import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import HeroVideoDialog from "@/components/magicui/hero-video";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, WandSparkles } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  return (
    <motion.a
      href="/blog/introducing-Sailsdock"
      className="flex w-auto items-center space-x-2 rounded-full bg-primary/20 px-2 py-1 ring-1 ring-accent whitespace-pre"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="w-fit rounded-full bg-accent px-2 py-0.5 text-center text-xs font-medium text-primary sm:text-sm">
        🚀 Nyhet
      </div>
      <p className="text-xs font-medium text-primary sm:text-sm">
        Moderne kundeoppfølging
      </p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </motion.a>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-3xl flex-col space-y-4 overflow-hidden pt-8">
      <motion.h1
        className="text-center text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          Styrk din kundeoppfølging
        </motion.span>
        <motion.span
          className="block text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
        >
          med Sailsdock
        </motion.span>
      </motion.h1>
      <motion.p
        className="mx-auto max-w-2xl text-center text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-9 text-balance"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        Vi hjelper deg med å få nye kunder og følge opp eksisterende kunder på
        en ny, innovativ måte! Opplev kraften i vår komplette bedriftsdatabase
        og automatiserte lead-generering.
      </motion.p>
    </div>
  );
}

function HeroCTA() {
  return (
    <>
      <motion.div
        className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease }}
      >
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full sm:w-auto text-background flex gap-2"
          )}
        >
          <WandSparkles className="h-6 w-6" />
          Prøv gratis nå
        </Link>
        <Link
          href="/docs"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full sm:w-auto"
          )}
        >
          Les mer om Sailsdock
        </Link>
      </motion.div>
      <motion.p
        className="mt-5 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        Ingen kort nødvendig.
      </motion.p>
    </>
  );
}

function HeroImage() {
  return (
    <motion.div
      className="relative mx-auto flex w-full items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1, ease }}
    >
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="/dashboard.png"
        thumbnailAlt="Sailsdock Knowledge Center Dashboard"
        className="border rounded-lg shadow-lg max-w-screen-lg mt-16"
      />
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="hero">
      <div className="relative flex w-full flex-col items-center justify-start px-4 pt-32 sm:px-6 sm:pt-24 md:pt-32 lg:px-8">
        <HeroPill />
        <HeroTitles />
        <HeroCTA />
        <HeroImage />
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-1/3 bg-gradient-to-t from-background via-background to-transparent lg:h-1/4"></div>
      </div>
    </section>
  );
}
