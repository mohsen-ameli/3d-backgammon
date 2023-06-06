import NextAuth from "next-auth/next"
import { UserType } from "./types/User.type"
import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserType & DefaultSession["user"]
  }
}
