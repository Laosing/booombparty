import { BaseGame } from "../game-engine"
import {
  WordChainClientMessageType,
  WordChainSettingsSchema,
  GAME_CONFIG,
  GameState,
  ServerMessageType,
} from "../../shared/types"
import type * as Party from "partykit/server"
import type { WordChainClientMessage } from "../../shared/types"

export class WordChainGame extends BaseGame {
  currentWord: string = ""
  usedWords: Set<string> = new Set()

  winnerId: string | null = null
  activePlayerId: string | null = null
  timer: number = 0
  maxTimer: number = GAME_CONFIG.WORD_CHAIN.TIMER.DEFAULT
  startingLives: number = GAME_CONFIG.WORD_CHAIN.LIVES.DEFAULT

  private tickInterval: ReturnType<typeof setTimeout> | null = null
  private nextTickTime: number = 0

  constructor(server: any) {
    super(server)
  }

  onStart(): void {
    if (this.players.size < 1) {
      return // Need at least 1
    }

    if (!this.server.dictionaryReady) {
      this.broadcast({
        type: ServerMessageType.ERROR,
        message: "Dictionary not loaded!",
      })
      return
    }

    this.server.gameState = GameState.PLAYING
    this.usedWords = new Set()

    // Reset players
    for (const p of this.players.values()) {
      p.lives = this.startingLives
      p.isAlive = true
    }

    // Pick a random starting word to kick things off
    try {
      this.currentWord = this.server.dictionary.getRandomWord(4) // simple word
    } catch (e) {
      this.currentWord = "START"
    }
    this.usedWords.add(this.currentWord)

    this.startLoop()
    this.nextTurn(true)

    this.broadcast({
      type: ServerMessageType.SYSTEM_MESSAGE,
      message: `Word Chain Started! The first word is ${this.currentWord}.`,
    })
  }

  onMessage(message: string, sender: Party.Connection): void {
    try {
      const data = JSON.parse(message) as WordChainClientMessage
      switch (data.type) {
        case WordChainClientMessageType.START_GAME:
          if (
            this.players.get(sender.id)?.isAdmin &&
            (this.server.gameState === GameState.LOBBY ||
              this.server.gameState === GameState.ENDED)
          ) {
            this.onStart()
          }
          break
        case WordChainClientMessageType.STOP_GAME:
          if (
            this.players.get(sender.id)?.isAdmin &&
            this.server.gameState === GameState.PLAYING
          ) {
            this.endGame()
          }
          break
        case WordChainClientMessageType.SUBMIT_WORD:
          if (
            this.server.gameState === GameState.PLAYING &&
            this.activePlayerId === sender.id
          ) {
            this.handleGuess(sender.id, data.word)
          }
          break
        case WordChainClientMessageType.UPDATE_TYPING:
          if (
            this.server.gameState === GameState.PLAYING &&
            this.activePlayerId === sender.id
          ) {
            this.broadcast({
              type: ServerMessageType.TYPING_UPDATE,
              text: data.text,
            })
          }
          break
        case WordChainClientMessageType.UPDATE_SETTINGS:
          if (this.players.get(sender.id)?.isAdmin) {
            const result = WordChainSettingsSchema.safeParse(data)
            if (result.success) {
              const settings = result.data
              if (settings.maxTimer !== undefined)
                this.maxTimer = settings.maxTimer
              if (settings.startingLives !== undefined) {
                this.startingLives = settings.startingLives
                console.log("Updated startingLives:", this.startingLives)
              }
              if (settings.chatEnabled !== undefined)
                this.chatEnabled = settings.chatEnabled
              if (settings.gameLogEnabled !== undefined)
                this.gameLogEnabled = settings.gameLogEnabled

              this.server.broadcastState()
            }
          }
          break
      }
    } catch (e) {
      console.error(e)
    }
  }

  onTick(): void {
    if (this.server.gameState !== GameState.PLAYING) return

    this.timer -= 1
    this.broadcast({ type: ServerMessageType.STATE_UPDATE, timer: this.timer })

    if (this.timer <= 0) {
      this.handleTimeout()
    }
  }

  startLoop() {
    if (this.tickInterval) clearTimeout(this.tickInterval)
    this.nextTickTime = Date.now() + 1000
    this.tickInterval = setTimeout(() => this.loopStep(), 1000)
  }

  loopStep() {
    if (this.server.gameState !== GameState.PLAYING) return
    const now = Date.now()
    if (now - this.nextTickTime > 1000) this.nextTickTime = now

    this.onTick()

    this.nextTickTime += 1000
    const delay = Math.max(0, this.nextTickTime - Date.now())
    this.tickInterval = setTimeout(() => this.loopStep(), delay)
  }

  handleTimeout() {
    this.broadcast({
      type: ServerMessageType.EXPLOSION,
      playerId: this.activePlayerId,
    }) // Re-use explosion for dramatic effect?

    const player = this.players.get(this.activePlayerId!)
    if (player) {
      player.lives -= 1
      if (player.lives <= 0) {
        player.isAlive = false
        this.broadcast({
          type: ServerMessageType.SYSTEM_MESSAGE,
          message: `${player.name} is out!`,
        })
      } else {
        this.broadcast({
          type: ServerMessageType.SYSTEM_MESSAGE,
          message: `${player.name} lost a life!`,
        })
      }
    }
    this.nextTurn()
  }

  nextTurn(isFirst: boolean = false) {
    if (this.server.gameState !== GameState.PLAYING) return

    const alivePlayers = Array.from(this.players.values()).filter(
      (p) => p.isAlive,
    )

    // Win Condition
    if (alivePlayers.length === 0) {
      this.endGame(null)
      return
    }

    // Multiplayer Win: Last player standing
    if (this.players.size > 1 && alivePlayers.length === 1) {
      alivePlayers[0].wins++
      this.endGame(alivePlayers[0].id)
      return
    }

    // Solo play continues until death (alivePlayers < 1)

    if (isFirst) {
      this.activePlayerId = alivePlayers[0].id
    } else if (this.activePlayerId) {
      // Actually need to rotate through currently alive players
      const aliveIds = alivePlayers.map((p) => p.id)
      const currentIndex = aliveIds.indexOf(this.activePlayerId)
      let nextIndex = (currentIndex + 1) % aliveIds.length
      this.activePlayerId = aliveIds[nextIndex]
    } else {
      this.activePlayerId = alivePlayers[0].id
    }

    this.timer = this.maxTimer
    this.server.broadcastState()
  }

  handleGuess(playerId: string, word: string) {
    const upper = word.toUpperCase().trim()
    const lastCharOfCurrent = this.currentWord.slice(-1).toUpperCase()

    if (!upper.startsWith(lastCharOfCurrent)) {
      this.sendTo(playerId, {
        type: ServerMessageType.ERROR,
        message: `Must start with '${lastCharOfCurrent}'!`,
        hide: true,
      })
      return
    }

    if (this.usedWords.has(upper)) {
      this.sendTo(playerId, {
        type: ServerMessageType.ERROR,
        message: "Word already used!",
        hide: true,
      })
      return
    }

    if (!this.server.dictionary.isWordValid(upper)) {
      this.sendTo(playerId, {
        type: ServerMessageType.ERROR,
        message: "Not in dictionary!",
        hide: true,
      })
      return
    }

    // Success
    this.usedWords.add(upper)
    this.currentWord = upper

    // Bonus for long words?

    const player = this.players.get(playerId)
    this.broadcast({
      type: ServerMessageType.VALID_WORD,
      word: upper,
      playerId,
      message: `${player ? player.name : "Unknown"} played ${upper}`,
    })

    this.nextTurn()
  }

  endGame(winnerId?: string | null) {
    this.server.gameState = GameState.ENDED
    this.winnerId = winnerId || null
    if (this.tickInterval) clearTimeout(this.tickInterval)
    this.broadcast({
      type: ServerMessageType.GAME_OVER,
      winnerId,
      message: winnerId ? "We have a winner!" : "Game Over",
    })
    this.server.broadcastState()
  }

  getState(): Record<string, any> {
    return {
      currentWord: this.currentWord,
      activePlayerId: this.activePlayerId,
      timer: this.timer,
      maxTimer: this.maxTimer,
      startingLives: this.startingLives,
      chatEnabled: this.chatEnabled,
      gameLogEnabled: this.gameLogEnabled,
      usedWordsCount: this.usedWords.size,
      winnerId: this.winnerId,
    }
  }
}
