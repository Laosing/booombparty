import type { WordChainSettings } from "../../../shared/types"
import { GAME_CONFIG } from "../../../shared/types"

import { NumberInput, ToggleInput } from "../SettingsInputs"

interface WordChainSettingsProps {
  settings: WordChainSettings
  onUpdate: (settings: Partial<WordChainSettings> & Record<string, any>) => void
}

export default function WordChainSettings({
  settings,
  onUpdate,
}: WordChainSettingsProps) {
  const { maxTimer, startingLives } = settings

  return (
    <>
      <NumberInput
        label="Turn Timer (seconds)"
        value={maxTimer ?? GAME_CONFIG.WORD_CHAIN.TIMER.DEFAULT}
        min={GAME_CONFIG.WORD_CHAIN.TIMER.MIN}
        max={GAME_CONFIG.WORD_CHAIN.TIMER.MAX}
        onChange={(val) => onUpdate({ maxTimer: val as any })}
        helperText={`Value between ${GAME_CONFIG.WORD_CHAIN.TIMER.MIN} and ${GAME_CONFIG.WORD_CHAIN.TIMER.MAX}`}
      />

      <NumberInput
        label="Starting Lives"
        value={startingLives ?? GAME_CONFIG.WORD_CHAIN.LIVES.DEFAULT}
        min={GAME_CONFIG.WORD_CHAIN.LIVES.MIN}
        max={GAME_CONFIG.WORD_CHAIN.LIVES.MAX}
        onChange={(val) => onUpdate({ startingLives: val as any })}
        helperText={`Value between ${GAME_CONFIG.WORD_CHAIN.LIVES.MIN} and ${GAME_CONFIG.WORD_CHAIN.LIVES.MAX}`}
      />

      <ToggleInput
        label="Enable Chat"
        checked={settings.chatEnabled ?? true}
        onChange={(checked) => onUpdate({ chatEnabled: checked })}
        helperText="Allow players to chat during the game."
      />

      <ToggleInput
        label="Enable Game Log"
        checked={settings.gameLogEnabled ?? true}
        onChange={(checked) => onUpdate({ gameLogEnabled: checked })}
        helperText="Show game events in the log."
      />
    </>
  )
}
