export type ProfileData = {
  data: {
    username: string
    image: string
    games_won: number
    games_lost: number
    total_games: number
    date_joined: number
  }
  loading: boolean
  error: string
}
