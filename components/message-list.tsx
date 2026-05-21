"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface Message {
  id: string
  city: string
  username: string
  text: string
  timestamp: Date
}

interface MessageListProps {
  messages: Message[]
}

function MessageCard({ message }: { message: Message }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <Card
      key={message.id}
      className={`transition-[opacity,transform] duration-700 ease-out transform-gpu will-change-[opacity,transform] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } hover:shadow-md`}
    >
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground truncate">{message.city}</h4>
                <p className="text-xs text-muted-foreground truncate">Por {message.username}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3 w-3" />
                <span>
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 break-words">{message.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-muted-foreground">Nenhuma mensagem ainda</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Clique em uma cidade no mapa para enviar uma mensagem
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2 scroll-smooth">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  )
}
