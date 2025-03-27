import { redirect } from "next/navigation"

export default function Home() {
  // Redirect directly to dashboard, bypassing authentication
  redirect("/dashboard")
  return null
}

