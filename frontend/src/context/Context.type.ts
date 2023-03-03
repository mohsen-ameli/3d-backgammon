import { ErrorType } from "./Error.type"
import { TokenType } from "./Token.type"
import { UserType } from "./User.type"

export type AuthContextProviderProps = {
  children: React.ReactNode
}

export type GameModeType = "pass-and-play" | string | undefined

export type AuthContextType = {
  gameMode: React.MutableRefObject<GameModeType>
  ws: WebSocket | undefined

  user: UserType
  setUser: React.Dispatch<React.SetStateAction<UserType>>
  tokens: TokenType
  setTokens: React.Dispatch<React.SetStateAction<TokenType>>
  inGame: boolean
  setInGame: React.Dispatch<React.SetStateAction<boolean>>
  errors: ErrorType
  setErrors: React.Dispatch<React.SetStateAction<ErrorType>>

  login: (username: string, password: string) => void
  logout: () => void
  signup: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => void
}
