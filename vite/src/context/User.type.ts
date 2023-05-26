import { JwtPayload } from "jwt-decode"

export type UserType =
  | (JwtPayload & { user_id: number; username: string })
  | null
