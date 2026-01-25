import { describe, it, expect, beforeEach, vi } from "vitest"
import Server from "../../party/server"
import {
  MockRoom,
  MockConnection,
  createMockConnectionContext,
} from "../mocks/party"
import {
  GameState,
  GameMode,
  WordChainClientMessageType,
  ServerMessageType,
} from "../../shared/types"
import { WordChainGame } from "../../party/games/word-chain"

// Mock DictionaryManager
vi.mock("../../party/dictionary", () => ({
  DictionaryManager: class {
    load = vi.fn().mockResolvedValue({ success: true })
    isWordValid = vi.fn().mockReturnValue(true)
    getRandomWord = vi.fn().mockReturnValue("START")
  },
}))

describe("Word Chain Game Logic", () => {
  let room: MockRoom
  let server: Server

  beforeEach(() => {
    room = new MockRoom("test")
    room.storage.put("gameMode", GameMode.WORD_CHAIN)
    server = new Server(room as any)
    server.gameMode = GameMode.WORD_CHAIN

    server.logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    } as any
  })

  const joinPlayer = async (id: string) => {
    const conn = new MockConnection(id)
    room.connections.set(id, conn as any)
    await server.onConnect(conn as any, createMockConnectionContext())
    return conn
  }

  it("should start game with initial word", async () => {
    const host = await joinPlayer("host")

    await server.onMessage(
      JSON.stringify({
        type: WordChainClientMessageType.START_GAME,
      }),
      host as any,
    )

    expect(server.gameState).toBe(GameState.PLAYING)
    const game = server.activeGame as WordChainGame
    expect(game.currentWord).toBe("START")
  })

  it("should accept valid chain word", async () => {
    const host = await joinPlayer("host")
    await joinPlayer("p2")
    await server.onMessage(
      JSON.stringify({ type: WordChainClientMessageType.START_GAME }),
      host as any,
    )

    const game = server.activeGame as WordChainGame
    game.currentWord = "TEST"

    const activeConn = room.connections.get(game.activePlayerId!)

    // Must start with T
    await server.onMessage(
      JSON.stringify({
        type: WordChainClientMessageType.SUBMIT_WORD,
        word: "TIGER",
      }),
      activeConn as any,
    )

    expect(game.currentWord).toBe("TIGER")
    expect(game.usedWords.has("TIGER")).toBe(true)
  })

  it("should reject invalid start letter", async () => {
    const host = await joinPlayer("host")
    await server.onMessage(
      JSON.stringify({ type: WordChainClientMessageType.START_GAME }),
      host as any,
    )

    const game = server.activeGame as WordChainGame
    game.currentWord = "TEST"
    const activeConn = room.connections.get(game.activePlayerId!)

    // Starts with A, expected T
    await server.onMessage(
      JSON.stringify({
        type: WordChainClientMessageType.SUBMIT_WORD,
        word: "APPLE",
      }),
      activeConn as any,
    )

    expect(game.currentWord).toBe("TEST") // Should not change
    expect(activeConn?.send).toHaveBeenCalledWith(
      expect.stringContaining(ServerMessageType.ERROR),
    )
  })

  it("should reject repeated word", async () => {
    const host = await joinPlayer("host")
    await server.onMessage(
      JSON.stringify({ type: WordChainClientMessageType.START_GAME }),
      host as any,
    )

    const game = server.activeGame as WordChainGame
    game.currentWord = "TEST"
    game.usedWords.add("TIGER") // Simulate "TIGER" was used

    const activeConn = room.connections.get(game.activePlayerId!)

    await server.onMessage(
      JSON.stringify({
        type: WordChainClientMessageType.SUBMIT_WORD,
        word: "TIGER",
      }),
      activeConn as any,
    )

    expect(game.currentWord).toBe("TEST")
    expect(activeConn?.send).toHaveBeenCalledWith(
      expect.stringContaining("Word already used"),
    )
  })
})
