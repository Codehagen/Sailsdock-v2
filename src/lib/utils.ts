import { siteConfig } from "@/lib/config"
import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import ms from "ms"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || siteConfig.url}${path}`
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = absoluteUrl("/og"),
  ...props
}: {
  title?: string
  description?: string
  image?: string
  [key: string]: Metadata[keyof Metadata]
}): Metadata {
  return {
    title: {
      template: "%s | " + siteConfig.name,
      default: siteConfig.name,
    },
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    icons: "/favicon.ico",
    metadataBase: new URL(siteConfig.url),
    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],
    ...props,
  }
}

export function nFormatter(
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  }
) {
  if (!num) return "0"
  if (opts.full) {
    return Intl.NumberFormat("en-US").format(num)
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, "$1") + item.symbol
    : "0"
}

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length - 3)}...`
}

// export function formatDate(date: string) {
//   let currentDate = new Date().getTime();
//   if (!date.includes("T")) {
//     date = `${date}T00:00:00`;
//   }
//   let targetDate = new Date(date).getTime();
//   let timeDifference = Math.abs(currentDate - targetDate);
//   let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//   let fullDate = new Date(date).toLocaleString("en-us", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   if (daysAgo < 1) {
//     return "Today";
//   } else if (daysAgo < 7) {
//     return `${fullDate} (${daysAgo}d ago)`;
//   } else if (daysAgo < 30) {
//     const weeksAgo = Math.floor(daysAgo / 7);
//     return `${fullDate} (${weeksAgo}w ago)`;
//   } else if (daysAgo < 365) {
//     const monthsAgo = Math.floor(daysAgo / 30);
//     return `${fullDate} (${monthsAgo}mo ago)`;
//   } else {
//     const yearsAgo = Math.floor(daysAgo / 365);
//     return `${fullDate} (${yearsAgo}y ago)`;
//   }
// }

export const formatDate = (dateString: string) => {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean
  } = {}
): string => {
  if (!timestamp) return "Never"
  const diff = Date.now() - new Date(timestamp).getTime()
  if (diff < 1000) {
    // less than 1 second
    return "Just now"
  } else if (diff > 82800000) {
    // more than 23 hours – similar to how Twitter displays timestamps
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    })
  }
  return `${ms(diff)}${withAgo ? " ago" : ""}`
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.startsWith("www.") ? domain.slice(4) : domain
  } catch {
    return url
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "" // Empty string for client-side, will use relative URLs
  }
  // Server-side
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  return "https://www.sailsdock.no"
}

export function getFullUrl(path: string) {
  const baseUrl = getBaseUrl()
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

export function filterEmptySearchParams(params: any) {
  if (!params) return
  return Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== "" && value != null)
      .map(([key, value]) => [key, String(value)])
  )
}
