import axios from "axios"
import jwt_decode, { JwtPayload } from "jwt-decode"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { TokenType } from "../../context/Token.type"
import getServerUrl from "../utils/getServerUrl"

/**
 * This hook will check if the access token is expired. If it is, it will use the refresh token to get a new access token.
 * @param {*} tokens The current tokens
 * @param {*} skip Skipping the check of the access token expiration
 * @returns A function that gets the freshest tokens in the world
 */
const useGetFreshTokens = (tokens: TokenType, skip: boolean = false) => {
  const { setTokens, setUser } = useContext(AuthContext)

  const getFreshTokens = async () => {
    if (!skip) {
      // Checking if the access token is expired
      const jwt: JwtPayload = jwt_decode(tokens?.access!)
      const expire = jwt.exp!
      const now = Date.now() / 1000

      // Access token is not expired
      if (now < expire) return tokens
    }

    // Access token is expired. Will use the refresh token to get a new access token
    try {
      const response = await axios.post(
        `${getServerUrl()}/api/token/refresh/`,
        {
          refresh: tokens?.refresh,
        }
      )

      if (response.status === 200) {
        const freshTokens: TokenType = {
          access: response.data.access,
          refresh: tokens?.refresh!,
        }

        // Saving the fresh tokens
        localStorage.setItem("tokens", JSON.stringify(freshTokens))
        setUser(jwt_decode(freshTokens.access))
        setTokens(freshTokens)

        return freshTokens
      }
    } catch (error) {}
  }

  return getFreshTokens
}

export default useGetFreshTokens
