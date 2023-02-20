const getServerUrl = (http = true) => {
  if (process.env.NODE_ENV === "development") {
    return http ? "http://localhost:8000" : "ws://localhost:8000"
  } else {
    return http ? "https://3d-backgammon.up.railway.app" : "wss://3d-backgammon.up.railway.app" // prettier-ignore
  }
}

export default getServerUrl
