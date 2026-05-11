import { ipcMain } from "electron"
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
} from "../db/repos/articlesRepo"
import { assertString } from "./validate"
import type { ArticleCreateInput, ArticleUpdateInput } from "../../shared/types"

export function registerArticlesIpc(): void {
  ipcMain.handle("articles:list", () => listArticles())

  ipcMain.handle("articles:get", (_e, id: unknown) => {
    assertString(id, "id")
    return getArticle(id)
  })

  ipcMain.handle("articles:create", (_e, input: unknown) => {
    const { title, body_json, body_html } = input as ArticleCreateInput
    assertString(title, "title")
    if (body_json !== undefined) assertString(body_json, "body_json")
    if (body_html !== undefined) assertString(body_html, "body_html")
    return createArticle({ title, body_json, body_html })
  })

  ipcMain.handle("articles:update", (_e, input: unknown) => {
    const { id, title, body_json, body_html } = input as ArticleUpdateInput
    assertString(id, "id")
    if (title !== undefined) assertString(title, "title")
    if (body_json !== undefined) assertString(body_json, "body_json")
    if (body_html !== undefined) assertString(body_html, "body_html")
    return updateArticle({ id, title, body_json, body_html })
  })

  ipcMain.handle("articles:delete", (_e, id: unknown) => {
    assertString(id, "id")
    deleteArticle(id)
  })
}
