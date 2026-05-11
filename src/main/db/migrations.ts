import type Database from "better-sqlite3"
import { readdirSync, readFileSync } from "fs"
import { join } from "path"

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version     INTEGER PRIMARY KEY,
      name        TEXT NOT NULL,
      applied_at  INTEGER NOT NULL
    )
  `)

  const row = db.prepare("SELECT COALESCE(MAX(version), 0) AS v FROM _migrations").get() as { v: number }
  const currentVersion = row.v

  const migrationsDir = join(__dirname, "migrations")
  let files: string[]
  try {
    files = readdirSync(migrationsDir)
  } catch {
    console.warn("[db] no migrations directory found at", migrationsDir)
    return
  }

  const sqlFiles = files
    .filter((f) => f.endsWith(".sql"))
    .sort()

  for (const file of sqlFiles) {
    const match = file.match(/^(\d{3})_(.+)\.sql$/)
    if (!match) {
      throw new Error(`[db] unparseable migration filename: ${file}`)
    }

    const version = Number.parseInt(match[1], 10)
    const name = match[2]

    if (version <= currentVersion) continue

    const sql = readFileSync(join(migrationsDir, file), "utf-8")

    const apply = db.transaction(() => {
      db.exec(sql)
      db.prepare(
        "INSERT INTO _migrations (version, name, applied_at) VALUES (?, ?, ?)"
      ).run(version, name, Date.now())
    })

    apply()
    console.log(`[db] migration ${version} ${name} applied`)
  }
}
