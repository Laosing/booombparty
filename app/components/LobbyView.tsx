import { useState, useEffect } from "react"
import usePartySocket from "partysocket/react"

export default function LobbyView() {
  const [availableRooms, setAvailableRooms] = useState<
    { id: string; players: number; isPrivate?: boolean }[]
  >([])
  const [newRoomName, setNewRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const err = params.get("error")
    if (err === "password") setErrorMsg("Invalid password provided.")
    if (err === "inactivity")
      setErrorMsg("You were disconnected due to inactivity.")

    // Clean URL
    if (err) {
      window.history.replaceState({}, "", "/")
    }
  }, [])

  usePartySocket({
    party: "lobby",
    room: "global",
    onMessage(evt) {
      const data = JSON.parse(evt.data)
      if (data.type === "ROOM_LIST") {
        setAvailableRooms(data.rooms)
      }
    },
  })

  const joinRoom = (room: string, password?: string) => {
    let url = `/?room=${room}`
    if (password) url += `&password=${encodeURIComponent(password)}`
    window.location.href = url
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return
    joinRoom(newRoomName, roomPassword)
  }

  return (
    <div className="game-container">
      <div className="card">
        <h1 style={{ color: "var(--accent-color)" }}>💣 BlitzParty Lobby</h1>
        <p>Choose a room to join or create a new one.</p>

        {errorMsg && (
          <div
            style={{
              background: "#ff4444",
              color: "white",
              padding: "10px",
              borderRadius: "4px",
              margin: "1rem 0",
              fontWeight: "bold",
            }}
          >
            {errorMsg}
            <button
              onClick={() => setErrorMsg(null)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <form
          onSubmit={handleCreate}
          style={{
            margin: "2rem 0",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Create Room Name..."
            style={{ maxWidth: "200px" }}
          />
          <input
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            placeholder="Password (Optional)"
            type="password"
            style={{ maxWidth: "150px" }}
          />
          <button type="submit">Create</button>
        </form>

        <div style={{ textAlign: "left", width: "100%" }}>
          <h3 style={{ marginBottom: "1rem" }}>
            Active Rooms ({availableRooms.length})
          </h3>

          {availableRooms.length === 0 && (
            <p style={{ opacity: 0.5, textAlign: "center" }}>
              No active games found.
            </p>
          )}

          <div style={{ display: "grid", gap: "10px" }}>
            {availableRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  if (r.isPrivate) {
                    const p = prompt("Enter password for " + r.id)
                    if (p) joinRoom(r.id, p)
                  } else {
                    joinRoom(r.id)
                  }
                }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                }
              >
                <span style={{ fontWeight: "bold" }}>{r.id}</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {r.isPrivate && <span>🔒</span>}
                  <span
                    style={{
                      background: "#444",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {r.players} Player{r.players !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
