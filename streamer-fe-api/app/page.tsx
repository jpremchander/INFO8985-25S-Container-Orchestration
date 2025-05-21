import { ChatInterface } from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-theme">
      <main className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        <ChatInterface />
      </main>
    </ThemeProvider>
  )
}
