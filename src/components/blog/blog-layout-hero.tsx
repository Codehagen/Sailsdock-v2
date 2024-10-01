"use client";

import { BLOG_CATEGORIES } from "@/lib/blog/content";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, List } from "lucide-react";
import MaxWidthWrapper from "@/lib/hooks/max-width-wrapper";
import { cn } from "@/lib/utils";
import Popover from "./popover";
import { siteConfig } from "@/lib/config";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogLayoutHero() {
  const { slug } = useParams() as { slug?: string };
  const [openPopover, setOpenPopover] = useState(false);

  const data = BLOG_CATEGORIES.find((category) => category.slug === slug);
  const currentTab = slug || "overview";

  return (
    <>
      <MaxWidthWrapper>
        <div className="max-w-screen-sm py-16">
          <h1 className="font-display text-3xl font-extrabold text-gray-700 sm:text-4xl">
            {data?.title || "Blog"}
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            {data?.description ||
              `Latest news and updates from ${siteConfig.name}.`}
          </p>
          <Tabs value={currentTab} className="mt-6 w-fit">
            <TabsList className="h-auto bg-white border border-gray-200 p-1 rounded-full">
              <TabsTrigger value="overview" asChild>
                <CustomTab href="/blog" isActive={currentTab === "overview"}>
                  Overview
                </CustomTab>
              </TabsTrigger>
              {BLOG_CATEGORIES.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug} asChild>
                  <CustomTab
                    href={`/blog/category/${category.slug}`}
                    isActive={currentTab === category.slug}
                  >
                    {category.title}
                  </CustomTab>
                </TabsTrigger>
              ))}
              <TabsTrigger value="customers" asChild>
                <CustomTab
                  href="/customers"
                  isActive={currentTab === "customers"}
                >
                  Customer Stories
                </CustomTab>
              </TabsTrigger>
              <TabsTrigger value="changelog" asChild>
                <CustomTab
                  href="/changelog"
                  isActive={currentTab === "changelog"}
                >
                  Changelog
                </CustomTab>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </MaxWidthWrapper>
      <Popover
        content={
          <div className="w-full p-4">
            <CategoryLink
              title="Overview"
              href="/blog"
              active={!slug}
              mobile
              setOpenPopover={setOpenPopover}
            />
            {BLOG_CATEGORIES.map((category) => (
              <CategoryLink
                key={category.slug}
                title={category.title}
                href={`/blog/category/${category.slug}`}
                active={category.slug === slug}
                mobile
                setOpenPopover={setOpenPopover}
              />
            ))}
            <CategoryLink title="Customer Stories" href="/customers" mobile />
            <CategoryLink title="Changelog" href="/changelog" mobile />
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        mobileOnly
      >
        <button
          onClick={() => {
            setOpenPopover(!openPopover);
          }}
          className="flex w-full items-center space-x-2 border-t border-gray-200 px-2.5 py-4 text-sm"
        >
          <List size={16} />
          <p>Categories</p>
        </button>
      </Popover>
    </>
  );
}

interface CustomTabProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function CustomTab({ href, isActive, children }: CustomTabProps) {
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full px-4 py-2 text-sm transition-all",
          isActive
            ? "text-white"
            : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        )}
      >
        {children}
      </div>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-800"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

const CategoryLink = ({
  title,
  href,
  active,
  mobile,
  setOpenPopover,
}: {
  title: string;
  href: string;
  active?: boolean;
  mobile?: boolean;
  setOpenPopover?: (open: boolean) => void;
}) => {
  if (mobile) {
    return (
      <Link
        href={href}
        {...(setOpenPopover && {
          onClick: () => setOpenPopover(false),
        })}
        className="flex w-full items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
      >
        <p className="text-sm text-gray-600">{title}</p>
        {active && <Check size={16} className="text-gray-600" />}
      </Link>
    );
  }
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full px-4 py-2 text-sm text-gray-600 transition-all",
          active
            ? "text-white"
            : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        )}
      >
        {title}
      </div>
      {active && (
        <motion.div
          layoutId="indicator"
          className="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-800"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
};
