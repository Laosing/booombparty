import "./styles.css"
import { createRoot } from "react-dom/client"
import GameCanvas from "./components/GameCanvas"
import LobbyView from "./components/LobbyView"

function App() {
  const params = new URLSearchParams(window.location.search)
  const room = params.get("room")

  return <main>{room ? <GameCanvas room={room} /> : <LobbyView />}</main>
}

createRoot(document.getElementById("app")!).render(<App />)
