"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function FilterButton({
  param,
  value,
  children,
  className,
  scroll,
}: {
  scroll?: boolean
  param: string
  value: string
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <Link
      scroll={scroll}
      className={className}
      href={pathname + "?" + createQueryString(param, value)}>
      {children}
    </Link>
  )
}
