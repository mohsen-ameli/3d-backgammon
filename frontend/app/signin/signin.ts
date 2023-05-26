// "use server"

// import getServerUrl from "@/components/utils/getServerUrl"
// import wsGood from "@/components/utils/wsGood"
// import { useAuthStore } from "@/store/useAuthStore"
// import axios, { AxiosError } from "axios"
// import jwtDecode from "jwt-decode"

// /**
//  * Logs a user in, saves the data in the auth store and returns the
//  * current state of the store, to be saved on the client as well.
//  * @param username
//  * @param password
//  * @returns The state of the auth store
//  */
// export default async function Signin(username: string, password: string) {
//   try {
//     const res = await axios.post(`${getServerUrl()}/api/token/`, { username, password })

//     if (res.status === 200) {
//       const tokens = {
//         access: res.data.access,
//         refresh: res.data.refresh,
//       }

//       // Saving the data to server state
//       useAuthStore.setState({
//         user: jwtDecode(tokens.access),
//         tokens,
//       })

//       const ws = useAuthStore.getState().ws

//       if (ws && wsGood(ws)) {
//         ws.send(JSON.stringify({ new_refresh: tokens.refresh, is_online: true }))
//       } else {
//         useAuthStore.setState({
//           ws: new WebSocket(`${getServerUrl(false)}/ws/status/${tokens.refresh}/`),
//         })
//       }
//     }
//   } catch (error: AxiosError | unknown) {
//     if (error instanceof AxiosError) {
//       return JSON.stringify(error)
//     }
//   }

//   return JSON.stringify(useAuthStore.getState())
// }
