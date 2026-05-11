import { useState } from "react"
import { CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function TasksPage() {
  const [result, setResult] = useState<string>("")

  const runSmokeTest = async () => {
    try {
      const lines: string[] = []

      const pong = await window.api.ping()
      lines.push(`ping: ${pong}`)

      const note = await window.api.notes.create({ text: "hello db" })
      lines.push(`created: ${note.id.slice(0, 8)}…`)

      const all = await window.api.notes.list()
      lines.push(`list: ${all.length} note(s)`)

      await window.api.notes.remove(note.id)

      const after = await window.api.notes.list()
      lines.push(`after remove: ${after.length} note(s)`)

      setResult(lines.join("\n"))
    } catch (err) {
      setResult(`ERROR: ${err}`)
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
      <CheckSquare className="h-12 w-12" />
      <p className="text-lg font-medium text-neutral-500">No tasks yet</p>
      <p className="text-sm">Coming in phase 3</p>

      {/* TODO: remove in phase 2 */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <Button onClick={runSmokeTest}>Run smoke test</Button>
        {result && (
          <pre className="rounded bg-neutral-100 p-3 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {result}
          </pre>
        )}
      </div>
    </div>
  )
}
