// "use client"

// import { useRef } from "react"
// import { useAuthStore } from "./useAuthStore"
// import { UserType } from "@/types/User.type"

// export default function StoreInitializer({ user }: { user: UserType }) {
//   const initialized = useRef(false)

//   if (!initialized.current) {
//     useAuthStore.setState({ user })
//     initialized.current = true
//   }

//   return null
// }
