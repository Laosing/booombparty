import clsx from "clsx"
import { CustomAvatar } from "./Logo"
import { HeartIcon, EditIcon } from "./Icons"
import type { Player } from "../../shared/types"

interface PlayerCardProps {
  player: Player
  isMe: boolean
  isAdmin: boolean
  isActive?: boolean
  isPlaying?: boolean
  onKick?: (playerId: string) => void
  onEditName?: () => void
  showLives?: boolean
  showWins?: boolean
  children?: React.ReactNode
}

export function PlayerCard({
  player,
  isMe,
  isAdmin,
  isActive,
  isPlaying,
  onKick,
  onEditName,
  showLives = true,
  showWins = true,
  children,
}: PlayerCardProps) {
  return (
    <div
      className={clsx(
        "card p-4 transition-all duration-300 border-2 relative group shadow-lg indicator w-full",
        isActive
          ? "border-primary bg-primary/10 z-10"
          : "border-transparent bg-base-100 placeholder-opacity-50",
        !player.isAlive && "opacity-50 grayscale",
      )}
    >
      {player.isAdmin && (
        <span className="indicator-item indicator-center badge badge-warning badge-sm">
          Admin
        </span>
      )}

      {isAdmin && !isMe && onKick && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onKick(player.id)
          }}
          className="absolute top-2 right-2 btn btn-xs btn-error btn-square z-20"
          title="Kick Player"
        >
          ✕
        </button>
      )}

      {isMe && (
        <>
          <span className="absolute top-2 left-2 badge badge-xs badge-primary">
            You
          </span>
        </>
      )}

      <div className="flex flex-col items-center gap-2">
        <div className="avatar">
          <CustomAvatar name={player.name} />
        </div>
        <div className="text-center w-full">
          <h3 className="font-bold flex items-center justify-center truncate">
            {player.name}
            {isMe && (
              <button
                onClick={onEditName}
                className="btn btn-xs btn-ghost btn-circle"
                title="Edit Name"
              >
                <EditIcon />
              </button>
            )}
          </h3>
          {showLives && isPlaying && (
            <div className="flex gap-1 justify-center text-error mt-1 text-sm h-5 items-center">
              {Array.from({ length: Math.max(0, player.lives) }).map((_, i) => (
                <HeartIcon key={i} />
              ))}
            </div>
          )}
          {showWins && (
            <div className="text-xs opacity-60 mt-1">
              Wins: {player.wins || 0}
            </div>
          )}

          {children && <div className="mt-2 text-xs">{children}</div>}
        </div>
      </div>
    </div>
  )
}
