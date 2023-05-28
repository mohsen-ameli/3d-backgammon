import { JwtPayload } from "jwt-decode"

export type ProvidersType = "credentials" | "discord"

export type BaseUser = {
  id: string
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
  token: TokenType
  provider: ProvidersType
}
