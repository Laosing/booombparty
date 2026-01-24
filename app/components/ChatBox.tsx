import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { useGameStore } from "../store/gameStore"

export function ChatBox() {
  const chatMessages = useGameStore((state) => state.chatMessages)
  const chatEnabled = useGameStore((state) => state.chatEnabled)
  const logs = useGameStore((state) => state.logs)
  const gameLogEnabled = useGameStore((state) => state.gameLogEnabled)
  const sendChat = useGameStore((state) => state.sendChat)

  const [chatInput, setChatInput] = useState("")
  const [isChatDisabled, setIsChatDisabled] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatEndRef.current?.parentElement) {
      chatEndRef.current.parentElement.scrollTop =
        chatEndRef.current.parentElement.scrollHeight
    }
  }, [chatMessages])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    sendChat(chatInput)
    setChatInput("")
    setIsChatDisabled(true)
    setTimeout(() => setIsChatDisabled(false), 1000)
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
      <div
        className={clsx(
          "card bg-base-100 p-4 h-48 shadow-lg",
          !gameLogEnabled && "opacity-25",
        )}
      >
        <h3 className="text-sm font-bold opacity-50 mb-2 uppercase tracking-wide">
          Game Log
        </h3>
        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1">
          {gameLogEnabled &&
            logs.map((l, i) => (
              <div key={i} className="border-l-2 border-primary/20 pl-2">
                <span className="opacity-50 mr-2">
                  {new Date(l.timestamp).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                {l.message}
              </div>
            ))}
        </div>
      </div>

      <div
        className={clsx(
          "card bg-base-100 p-4 h-48 shadow-lg flex flex-col",
          !chatEnabled && "opacity-25",
        )}
      >
        <h3 className="text-sm font-bold opacity-50 mb-2 uppercase tracking-wide">
          Chat
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2 mb-2">
          {chatMessages.map((msg, i) => (
            <div key={i} className="text-sm">
              <span className="opacity-50 text-xs mr-2 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="font-bold opacity-70">{msg.senderName}:</span>{" "}
              <span className="opacity-90">{msg.text}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={chatEnabled ? "Message..." : "Chat Disabled"}
            className="input input-sm input-bordered flex-1"
            maxLength={100}
            disabled={!chatEnabled}
          />
          <button
            type="submit"
            className="btn btn-sm btn-ghost"
            disabled={isChatDisabled || !chatEnabled}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
