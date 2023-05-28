import { TokenType, UserType } from "@/types/User.type"
import getServerUrl from "./getServerUrl"
import axios, { AxiosError } from "axios"
import { redirect } from "next/navigation"
import jwtDecode from "jwt-decode"

// export const dynamic = "auto"

export default async function getJWTToken(user: UserType): Promise<TokenType> {
  if (user.provider !== "credentials") {
    const { data }: { data: TokenType } = await axios.post(getServerUrl() + "/api/get-jwt-provider/", {
      id: user.id,
    })
    return data
  }

  const token = user.token

  const expired = isTokenExpired(token.access)
  if (!expired) return token

  try {
    const { data }: { data: TokenType } = await axios.post(getServerUrl() + "/api/token/refresh/", {
      refresh: token.refresh,
    })
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      redirect("/signin")
    }
    return token
  }
}

/**
 * @param accessToken
 * @returns boolean, whether the access token has expired
 */
function isTokenExpired(accessToken: string): boolean {
  const decodedToken: { exp?: number } = jwtDecode(accessToken)

  if (!decodedToken.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000) // Get current time in seconds

  // Compare the expiration time with the current time
  return decodedToken.exp < currentTime
}
