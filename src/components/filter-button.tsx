"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Button } from "./ui/button"

export default function FilterButton({
  param,
  value,
  children,
  className,
  size,
  variant,
  asChild = false,
  disabled,
  onClick
}: {
  asChild?: boolean
  param: string
  value: string
  children: React.ReactNode
  className?: string
  size?: any
  variant?: any
  disabled?: boolean
  onClick?: (state: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("cursor")

      if (name && !value) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  return (
    <Button
      disabled={disabled}
      asChild={asChild}
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        if (onClick) {
          onClick(true)
        }
        router.push(pathname + "?" + createQueryString(param, value))
      }}>
      {children}
    </Button>
  )
}
