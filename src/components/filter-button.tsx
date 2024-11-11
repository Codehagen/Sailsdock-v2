"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Button, ButtonProps } from "./ui/button"

export default function FilterButton({
  param,
  value,
  children,
  className,
  size,
  variant,
}: {
  param: string
  value: string
  children: React.ReactNode
  className?: string
  size?: any
  variant?: any
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
    <Button
      asChild
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        window.history.pushState(
          {},
          "",
          pathname + "?" + createQueryString(param, value)
        )
      }}>
      {children}
    </Button>
  )
}
