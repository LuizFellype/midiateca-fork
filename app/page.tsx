"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import MessageList from "@/components/message-list"
import { MapPin } from "lucide-react"

// Importar o mapa dinamicamente para evitar problemas com SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Carregando mapa...</p>
    </div>
  ),
})

interface Message {
  id: string
  city: string
  username: string
  text: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleMessageSubmit = (message: Message) => {
    setMessages((prev) => [message, ...prev])
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-center text-center">
          <div className="inline-flex gap-2">
            <img src='./icon.png' alt="Icone do Mapa" />
          </div>

          <div className="text-center w-full">

            <div className="flex justify-center items-center gap-2">

              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground text-balance">
                Qual lugar do <i>Espírito Santo</i> guarda a sua melhor história ?
              </h1>
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto text-pretty">

              Clique no mapa para deixar sua mensagem
            </p>
          </div>
        </header>

        <section className="h-[700px] b-8 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div className="order-2 lg:order-1">
            <MapComponent onMessageSubmit={handleMessageSubmit} />
          </div>

          <aside className="order-1 lg:order-2 rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Mensagens
                {messages.length > 0 && (
                  <span className="text-muted-foreground font-normal"> ({messages.length})</span>
                )}
              </h2>
            </div>
            <MessageList messages={messages} />
          </aside>
        </section>
      </div>
    </main>
  )
}
