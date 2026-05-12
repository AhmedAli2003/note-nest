# Note Nest

A distraction-free, offline-first personal workspace for your notes, tasks, and articles — all stored locally on your Windows machine. No cloud accounts. No subscriptions. Just your data, yours alone.

Built with Electron, React, TypeScript, and Vite.

## Download

Download the latest installer for Windows from the [Releases page](https://github.com/AhmedAli2003/note-nest/releases).

## Features

### Notes
A rich-text editor powered by [Tiptap](https://tiptap.dev/) — create, edit, and organize your thoughts with headings, bold, italic, bullet lists, code blocks with syntax highlighting, and links. Notes autosave when you click away, so you never lose a thought.

### Tasks
Stay on top of what matters. Create tasks, mark them complete, set due dates with a clean inline date picker, assign priority levels, and filter by status. Your personal to-do list, always at hand.

### Articles
Save long-form content and build your own reading library. The same powerful editor lets you take notes on what you read, all in one place.

### Global Search
Press `Ctrl+K` to instantly search across all your notes, tasks, and articles. Navigate results with the keyboard — no mouse needed.

### Export & Import
Your data is portable. Export your entire SQLite database from the sidebar, or import another `.db` file with two options: **Merge** (adds missing records) or **Replace** (swaps your current data entirely).

### Dark Mode
A full dark theme that respects your preference. Every surface, every scrollbar — styled for comfortable use at any hour.

### Keyboard Shortcuts
Quick-access shortcuts for common actions — stay in flow without reaching for the mouse.

### Private by Design
Everything lives in a local SQLite database on your machine. No cloud sync, no data leaving your computer, no accounts to create.

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Desktop  | Electron 33 |
| UI       | React 18, TypeScript |
| Editor   | Tiptap (ProseMirror) |
| Styling  | Tailwind CSS 3 |
| Database | better-sqlite3 |
| Icons    | Lucide React |
| State    | Zustand |
| Routing  | React Router 6 |
| Packaging| electron-builder (NSIS) |

## Development

```bash
# Install dependencies (with native module rebuild)
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Package installer
npm run package
```

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start development with hot reload   |
| `npm run build`   | Build for production                |
| `npm run preview` | Preview the production build        |
| `npm run package` | Build and package NSIS installer    |

## Project Structure

```
src/
├── main/            # Electron main process (IPC handlers, DB)
├── preload/         # Preload script (contextBridge API)
└── renderer/
    └── src/
        ├── app/         # App shell, router, theme provider
        ├── components/  # Shared UI components
        ├── features/    # Feature modules (notes, tasks, articles, search, settings)
        ├── hooks/       # React hooks
        ├── lib/         # Utilities (cn, date, time)
        ├── stores/      # Zustand stores (theme, settings, toasts)
        └── styles/      # Global CSS
```

## License

Copyright © 2026 Ahmed Abu Ali
