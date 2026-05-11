import { getDb } from ".."
import { newId } from "@shared/id"
import type { Article, ArticleCreateInput, ArticleUpdateInput } from "@shared/types"

const db = getDb()

const stmt = {
  list: db.prepare("SELECT * FROM articles ORDER BY updated_at DESC"),
  search: db.prepare("SELECT * FROM articles WHERE (title LIKE ? COLLATE NOCASE) OR (body_html LIKE ? COLLATE NOCASE) ORDER BY updated_at DESC LIMIT ?"),
  get: db.prepare("SELECT * FROM articles WHERE id = ?"),
  insert: db.prepare(
    "INSERT INTO articles (id, title, body_json, body_html, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  ),
  delete: db.prepare("DELETE FROM articles WHERE id = ?")
}

function rowToArticle(row: Record<string, unknown>): Article {
  return {
    id: row.id as string,
    title: row.title as string,
    body_json: row.body_json as string,
    body_html: row.body_html as string,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number
  }
}

export function searchArticles(query: string, limit = 20): Article[] {
  return (stmt.search.all(`%${query}%`, `%${query}%`, limit) as Record<string, unknown>[]).map(rowToArticle)
}

export function listArticles(): Article[] {
  return (stmt.list.all() as Record<string, unknown>[]).map(rowToArticle)
}

export function getArticle(id: string): Article | null {
  const row = stmt.get.get(id) as Record<string, unknown> | undefined
  return row ? rowToArticle(row) : null
}

export function createArticle(input: ArticleCreateInput): Article {
  const now = Date.now()
  const id = newId()
  stmt.insert.run(id, input.title, input.body_json ?? "", input.body_html ?? "", now, now)
  return getArticle(id)!
}

export function updateArticle(input: ArticleUpdateInput): Article {
  const now = Date.now()
  const sets: string[] = []
  const params: unknown[] = []

  if (input.title !== undefined) {
    sets.push("title = ?")
    params.push(input.title)
  }
  if (input.body_json !== undefined) {
    sets.push("body_json = ?")
    params.push(input.body_json)
  }
  if (input.body_html !== undefined) {
    sets.push("body_html = ?")
    params.push(input.body_html)
  }

  if (sets.length === 0) return getArticle(input.id)!

  sets.push("updated_at = ?")
  params.push(now)
  params.push(input.id)

  const result = db.prepare(`UPDATE articles SET ${sets.join(", ")} WHERE id = ?`).run(...params)
  if (result.changes === 0) throw new Error(`articles ${input.id} not found`)
  return getArticle(input.id)!
}

export function deleteArticle(id: string): void {
  stmt.delete.run(id)
}
