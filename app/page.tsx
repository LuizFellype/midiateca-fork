"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import MessageList from "@/components/message-list"
import { MapPin } from "lucide-react"

// Importar o mapa dinamicamente para evitar problemas com SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-xl bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Carregando mapa...</p>
    </div>
  ),
})

interface Message {
  id: string
  city: string
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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            Mapa do Espírito Santo
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            Clique em qualquer cidade para deixar uma mensagem. Explore todas as 78 cidades do
            estado!
          </p>
        </header>

        {/* Mapa */}
        <section className="mb-8">
          <MapComponent onMessageSubmit={handleMessageSubmit} />
        </section>

        {/* Lista de Mensagens */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Mensagens{" "}
              {messages.length > 0 && (
                <span className="text-muted-foreground font-normal">({messages.length})</span>
              )}
            </h2>
          </div>
          <MessageList messages={messages} />
        </section>
      </div>
    </main>
  )
}
