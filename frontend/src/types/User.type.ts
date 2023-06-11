import { JwtPayload } from "jwt-decode"

export type ProvidersType = "credentials" | "discord" | "twitch" | "google"

export type BaseUser = {
  id: number
  username: string
}

export type ErrorType = {
  message: string
  code: string
} | null

export type TokenType = {
  access: string
  refresh: string
}

export type UserType = JwtPayload & {
  id: string
  name: string
  email: string
  image: string
  premium: boolean
  token: TokenType
  provider: ProvidersType
}
