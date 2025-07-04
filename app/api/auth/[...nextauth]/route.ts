import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Validate required environment variables
if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error("GITHUB_CLIENT_ID is not set")
}

if (!process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("GITHUB_CLIENT_SECRET is not set")
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set")
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
