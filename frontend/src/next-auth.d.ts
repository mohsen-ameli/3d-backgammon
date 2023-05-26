import NextAuth from "next-auth/next"
import { UserType } from "./types/User.type"

declare module "next-auth" {
  interface Session {
    user: UserType
  }
}
