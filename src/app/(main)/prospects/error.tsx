"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full gap-6 justify-center items-center">
      <h2>Something went wrong!</h2>
      <Separator className="max-h-20" orientation="vertical" />
      <Button variant="outline" onClick={() => window.history.back()}>
        Go back
      </Button>
    </div>
  )
}
