/**
 * Used to get the url for the server, based on the environment
 * @param {*} http: boolean -> Used to differentiate between http and websocket connections
 * @returns A string that is the url to be hit
 */
export default function getServerUrl(http: boolean = true) {
  return http ? process.env.NEXT_PUBLIC_HTTP_SERVER! : process.env.NEXT_PUBLIC_WS_SERVER!
}
