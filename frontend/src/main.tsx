import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import "./assets/css/index.css"
import App from "./App"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./assets/fontawesome/all.min.css"
import React from "react"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)
