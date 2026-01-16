import initSqlJs from "sql.js"
import sqlWasm from "./sql-wasm.wasm"

export class DictionaryManager {
  private db: any = null
  public ready: Promise<void>
  private _resolveReady!: () => void
  private _isLoaded = false

  constructor() {
    this.ready = new Promise((resolve) => {
      this._resolveReady = resolve
    })
  }

  async load(origin: string) {
    if (this._isLoaded) return
    this._isLoaded = true

    console.log("Loading Dictionary from SQLite...")

    try {
      const dbUrl = new URL("/db.sqlite", origin).toString()

      const dbRes = await fetch(dbUrl)
      const dbBinary = await dbRes.arrayBuffer()

      const SQL = await initSqlJs({
        instantiateWasm: (imports, successCallback) => {
          WebAssembly.instantiate(sqlWasm, imports).then((instance) => {
            successCallback(instance)
          })
          return {}
        },
      })

      this.db = new SQL.Database(new Uint8Array(dbBinary))
      console.log(
        "SQL DB Loaded. Tables:",
        this.db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]
      )
      this._resolveReady()
    } catch (e) {
      console.error("Failed to load dictionary DB", e)
    }
  }

  isValid(word: string, syllable: string): { valid: boolean; reason?: string } {
    if (!this.db) return { valid: false, reason: "Dictionary loading..." }

    const normalizedWord = word.toLowerCase().trim()
    const normalizedSyllable = syllable.toLowerCase().trim()

    if (!normalizedWord.includes(normalizedSyllable)) {
      return { valid: false, reason: "Word does not contain the syllable." }
    }

    try {
      const stmt = this.db.prepare(
        "SELECT count(*) FROM English WHERE word = $word COLLATE NOCASE"
      )
      stmt.bind({ $word: normalizedWord })

      let valid = false
      if (stmt.step()) {
        const count = stmt.get()[0]
        if (count > 0) valid = true
      }
      stmt.free()

      if (!valid) return { valid: false, reason: "Word not in dictionary." }
      return { valid: true }
    } catch (e) {
      console.error("SQL Error", e)
      return { valid: false, reason: "Database error" }
    }
  }

  getRandomSyllable(minWords: number = 50): string {
    if (!this.db) return "ING"

    let attempts = 0
    while (attempts < 20) {
      try {
        const stmt = this.db.prepare(
          "SELECT word FROM English ORDER BY RANDOM() LIMIT 1"
        )
        let word = ""
        if (stmt.step()) {
          word = stmt.get()[0] as string
        }
        stmt.free()

        if (!word || word.length < 3) continue

        const len = Math.random() < 0.6 ? 2 : 3
        if (word.length < len) continue

        const start = Math.floor(Math.random() * (word.length - len + 1))
        const syllable = word.substring(start, start + len)

        const countStmt = this.db.prepare(
          "SELECT count(*) FROM English WHERE word LIKE $pattern"
        )
        countStmt.bind({ $pattern: `%${syllable}%` })
        let count = 0
        if (countStmt.step()) {
          count = countStmt.get()[0] as number
        }
        countStmt.free()

        if (count >= minWords) return syllable.toUpperCase()
        attempts++
      } catch (err) {
        console.error(err)
        break
      }
    }

    return "EST"
  }
}
