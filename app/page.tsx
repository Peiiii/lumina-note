"use client"

import { UIProvider } from "@/context/ui-context"
import { NotesProvider } from "@/context/notes-context"
import { AIProvider } from "@/context/ai-context"
import { App } from "@/components/app"

export default function LuminaDemo() {
  return (
    <UIProvider>
      <NotesProvider>
        <AIProvider>
          <App />
        </AIProvider>
      </NotesProvider>
    </UIProvider>
  )
}
