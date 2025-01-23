"use server"

import axios from "axios"

export async function sendSMS(
  to: string,
  message: string,
  from: string,
  test?: boolean
) {
  // Replace these with your actual username and password
  const username = "superdupercr" // Use environment variables for security
  const password = "c661fbae722d148f" // Use environment variables for security

  const params = `user=${encodeURIComponent(
    username
  )}&passwd=${encodeURIComponent(password)}&to=${encodeURIComponent(
    to
  )}&msg=${encodeURIComponent(message)}&from=${encodeURIComponent(from)}${
    test && "&test=true"
  }&f=json`

  const response = await axios.post(
    "https://sveve.no/SMS/SendMessage",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  )

  console.log(response.data.response)
  return response.data.response
}