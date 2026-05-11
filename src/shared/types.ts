// --- Notes ---
export interface Note {
  id: string
  text: string
  created_at: number
  updated_at: number
}

export interface NoteCreateInput {
  text: string
}

export interface NoteUpdateInput {
  id: string
  text: string
}

// --- Tasks ---
export type Priority = "high" | "medium" | "low"

export interface Task {
  id: string
  title: string
  due_at: number | null
  priority: Priority
  is_done: boolean
  created_at: number
  updated_at: number
}

export interface TaskCreateInput {
  title: string
  due_at?: number | null
  priority?: Priority
}

export interface TaskUpdateInput {
  id: string
  title?: string
  due_at?: number | null
  priority?: Priority
  is_done?: boolean
}

// --- Search ---
export interface SearchResults {
  notes: Note[]
  tasks: Task[]
  articles: Article[]
}

// --- Articles ---
export interface Article {
  id: string
  title: string
  body_json: string
  body_html: string
  created_at: number
  updated_at: number
}

export interface ArticleCreateInput {
  title: string
  body_json?: string
  body_html?: string
}

export interface ArticleUpdateInput {
  id: string
  title?: string
  body_json?: string
  body_html?: string
}
