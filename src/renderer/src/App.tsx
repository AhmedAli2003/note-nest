import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/app/ThemeProvider"
import { router } from "@/app/router"

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
