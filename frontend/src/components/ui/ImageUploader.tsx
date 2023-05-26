import { useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Center from "./Center"
import { ImageType } from "@/types/Image.type"
import notification from "../utils/Notification"
import Image from "next/image"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type ImageUploaderProps = {
  image: ImageType
  setImage: React.Dispatch<React.SetStateAction<ImageType>>
}

export default function ImageUploader({ image, setImage }: ImageUploaderProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setImage({ file, preview: URL.createObjectURL(file) })
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1000000, // 10 MB
  })

  useEffect(() => {
    if (fileRejections.length > 0) notification("Image should be less than 10MB.", "error")
  }, [fileRejections])

  return (
    <div
      {...getRootProps()}
      className="relative h-[200px] cursor-pointer rounded-lg border-2 border-dashed border-gray-400 bg-gray-200 p-4 text-center duration-150 ease-in-out hover:bg-gray-300"
    >
      <input {...getInputProps()} id="image-input" />
      {isDragActive ? (
        <Center className="flex h-full w-full items-center justify-center rounded-lg">
          <p className="text-center text-xl font-semibold">Drop the file here ...</p>
        </Center>
      ) : (
        <div className={"absolute left-1/2 w-full -translate-x-1/2 " + (image ? "top-5" : "top-1/2 -translate-y-1/2")}>
          <FontAwesomeIcon icon={faCloudArrowUp} className="mx-auto mb-2 h-8 w-8 text-2xl text-gray-400" />
          <p className="text-gray-400">Drag &apos;n&apos; drop a file here, or click to select a file</p>
        </div>
      )}
      {image && !isDragActive && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <Image
            width={250}
            height={250}
            src={image.preview}
            alt={image.file.name}
            className="mx-auto h-[75px] w-[75px] rounded-full object-cover object-center"
          />
        </div>
      )}
    </div>
  )
}
