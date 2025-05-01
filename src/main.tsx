import React from 'react'
import ReactDOM from 'react-dom/client'
import '../app/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { UIProvider } from "@/context/ui-context"
import { NotesProvider } from "@/context/notes-context"
import { AIProvider } from "@/context/ai-context"
import { App } from "@/components/app"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="lumina-note-theme">
      <UIProvider>
        <NotesProvider>
          <AIProvider>
            <App />
          </AIProvider>
        </NotesProvider>
      </UIProvider>
    </ThemeProvider>
  </React.StrictMode>,
) 