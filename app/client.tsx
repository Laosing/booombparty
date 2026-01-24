import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles.css"
import { router } from "./router"

// Layout styles
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const queryClient = new QueryClient()

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById("app")!).render(<App />)
