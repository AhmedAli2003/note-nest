import Database from "better-sqlite3"
import { app } from "electron"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"
import { runMigrations } from "./migrations"

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const dir = app.getPath("userData")
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  const file = join(dir, "note-nest.db")

  if (process.env.NODE_ENV !== "production") {
    console.log(`[db] opened ${file}`)
  }

  db = new Database(file)
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  runMigrations(db)

  return db
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
