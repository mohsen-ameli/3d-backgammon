import getServerUrl from "./getServerUrl"

/**
 * Little component to get the url of the image without sending a request to the server.
 */
const getImageUrl = (username: string) => {
  return getServerUrl() + "/media/profile_pics/" + username + ".jpg"
}

export default getImageUrl
