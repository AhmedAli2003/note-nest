import { useEffect } from "react"
import { useArticlesStore } from "./store"
import { ArticlesList } from "./ArticlesList"
import { ArticleEditor } from "./ArticleEditor"

export default function ArticlesPage() {
  useEffect(() => {
    useArticlesStore.getState().load()
  }, [])

  return (
    <div className="flex h-full">
      <ArticlesList />
      <ArticleEditor />
    </div>
  )
}
