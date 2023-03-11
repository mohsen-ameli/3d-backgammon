import { ImageType } from "../components/types/Image.type"
import { ErrorType } from "./Error.type"
import { TokenType } from "./Token.type"
import { UserType } from "./User.type"

export type AuthContextType = {
  ws: WebSocket | undefined
  user: UserType
  setUser: React.Dispatch<React.SetStateAction<UserType>>
  tokens: TokenType
  setTokens: React.Dispatch<React.SetStateAction<TokenType>>
  errors: ErrorType
  setErrors: React.Dispatch<React.SetStateAction<ErrorType>>

  login: (username: string, password: string) => void
  logout: () => void
  signup: (
    username: string,
    email: string,
    password: string,
    password2: string,
    image: ImageType
  ) => void
}
