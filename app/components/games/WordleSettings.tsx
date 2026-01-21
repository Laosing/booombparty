import { GAME_CONFIG } from "../../../shared/types"

interface WordleSettingsProps {
  maxTimer: number | string
  maxAttempts: number | string
  wordLength: number | string
  chatEnabled?: boolean
  gameLogEnabled?: boolean
  onUpdate: (settings: any) => void
}

export default function WordleSettings({
  maxTimer,
  maxAttempts,
  wordLength,
  chatEnabled,
  gameLogEnabled,
  onUpdate,
}: WordleSettingsProps) {
  return (
    <>
      <div className="form-control w-full max-w-xs mb-6 px-1">
        <label className="label cursor-pointer justify-start gap-4">
          <span className="label-text font-bold">Enable Chat</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={!!chatEnabled}
            onChange={(e) => onUpdate({ chatEnabled: e.target.checked })}
          />
        </label>
      </div>

      <div className="form-control w-full max-w-xs mb-6 px-1">
        <label className="label cursor-pointer justify-start gap-4">
          <span className="label-text font-bold">Enable Game Log</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={!!gameLogEnabled}
            onChange={(e) => onUpdate({ gameLogEnabled: e.target.checked })}
          />
        </label>
      </div>

      <div className="form-control w-full max-w-xs mb-6">
        <label className="label">
          <span className="label-text">Timer (Seconds)</span>
        </label>
        <input
          type="number"
          min={GAME_CONFIG.WORDLE.TIMER.MIN}
          max={GAME_CONFIG.WORDLE.TIMER.MAX}
          value={maxTimer ?? GAME_CONFIG.WORDLE.TIMER.DEFAULT}
          onChange={(e) => {
            const val = e.target.value
            onUpdate({
              maxTimer: val === "" ? "" : parseInt(val),
            })
          }}
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text-alt opacity-70">
            Value between {GAME_CONFIG.WORDLE.TIMER.MIN} and{" "}
            {GAME_CONFIG.WORDLE.TIMER.MAX}
          </span>
        </label>
      </div>

      <div className="form-control w-full max-w-xs mb-6">
        <label className="label">
          <span className="label-text">Max Attempts</span>
        </label>
        <input
          type="number"
          min={GAME_CONFIG.WORDLE.ATTEMPTS.MIN}
          max={GAME_CONFIG.WORDLE.ATTEMPTS.MAX}
          value={maxAttempts ?? GAME_CONFIG.WORDLE.ATTEMPTS.DEFAULT}
          onChange={(e) => {
            const val = e.target.value
            onUpdate({
              maxAttempts: val === "" ? "" : parseInt(val),
            })
          }}
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text-alt opacity-70">
            Value between {GAME_CONFIG.WORDLE.ATTEMPTS.MIN} and{" "}
            {GAME_CONFIG.WORDLE.ATTEMPTS.MAX}
          </span>
        </label>
      </div>

      <div className="form-control w-full max-w-xs mb-6">
        <label className="label">
          <span className="label-text">Word Length</span>
        </label>
        <input
          type="number"
          min={GAME_CONFIG.WORDLE.LENGTH.MIN}
          max={GAME_CONFIG.WORDLE.LENGTH.MAX}
          value={wordLength ?? GAME_CONFIG.WORDLE.LENGTH.DEFAULT}
          onChange={(e) => {
            const val = e.target.value
            onUpdate({
              wordLength: val === "" ? "" : parseInt(val),
            })
          }}
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label">
          <span className="label-text-alt opacity-70">
            Value between {GAME_CONFIG.WORDLE.LENGTH.MIN} and{" "}
            {GAME_CONFIG.WORDLE.LENGTH.MAX}
          </span>
        </label>
      </div>
    </>
  )
}
