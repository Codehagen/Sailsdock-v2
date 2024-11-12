"use server"

import { prospectSchema } from "@/components/prospects/types"

export async function getProspects(params: any): Promise<{
  data: prospectSchema[]
  pagination: {
    next: string | null
    prev: string | null
  }
}> {
  const filteredParams = Object.fromEntries(
    Object.entries(params)
      .filter(([_, value]) => value !== "" && value != null)
      .map(([key, value]) => [key, String(value)])
  )
  const urlSearchParams = new URLSearchParams(filteredParams)
  const url = `https://crm.vegardenterprises.com/internal/v1/prospects?${
    urlSearchParams?.toString() ?? ""
  }`

  // fetch ENV
  const citadel_lock = process.env.FRONTEND_LOCK
  const citadel_key = process.env.FRONTEND_KEY
  const citadel_id = process.env.FRONTEND_ID

  // build headers
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("X-CITADEL-LOCK", citadel_lock ?? "")
  headers.append("X-CITADEL-KEY", citadel_key ?? "")
  headers.append("X-CITADEL-ID", citadel_id ?? "")

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "force-cache",
  }).then((res) => res.json())

  const data = {
    data: response.results,
    pagination: {
      next: response.next,
      prev: response.previous,
    },
  }

  return data
}
