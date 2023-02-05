import { toast } from "react-toastify"

const notification = (type = "default", msg) => {
  const args = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  if (type === "default") {
    toast(msg, args)
  } else if (type === "error") {
    toast.error(msg, args)
  }
}

export default notification
