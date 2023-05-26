import getServerUrl from "@/components/utils/getServerUrl"
import { ImageType } from "@/types/Image.type"
import axios, { AxiosError } from "axios"
import { Dispatch, SetStateAction } from "react"

export default async function signup(
  username: string,
  email: string,
  password: string,
  password2: string,
  image: ImageType,
  setErrors: Dispatch<
    SetStateAction<{
      message: string
      code: string
    }>
  >,
) {
  try {
    const newImage =
      image &&
      new File([image.file], username + ".jpg", {
        type: "image/jpeg",
      })

    const context = {
      username,
      email,
      password,
      password2,
      image: newImage,
    }

    const config = image
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {}

    const res = await axios.post(`${getServerUrl()}/api/signup/`, context, config)

    if (res.status === 200) {
      return true
    }
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      setErrors(error.response?.data)
      return false
    }
  }
}
