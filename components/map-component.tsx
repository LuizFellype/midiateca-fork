"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { espiritoSantoCities, type City } from "@/lib/es-cities"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Message {
  id: string
  city: string
  username: string
  text: string
  timestamp: Date
}

interface MapComponentProps {
  onMessageSubmit: (message: Message) => void
}

function CityMarker({
  city,
  onMessageSubmit,
}: {
  city: City
  onMessageSubmit: (message: Message) => void
}) {
  const [author, setAuthor] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const map = useMap()

  const handleSubmit = () => {
    if (!author.trim() || !inputValue.trim()) return

    setIsSubmitting(true)
    const message: Message = {
      id: `${city.name}-${Date.now()}`,
      city: city.name,
      username: author.trim(),
      text: inputValue.trim(),
      timestamp: new Date(),
    }
    onMessageSubmit(message)
    setAuthor("")
    setInputValue("")
    setIsSubmitting(false)
    map.closePopup()
  }

  return (
    <Marker position={[city.lat, city.lng]}>
      <Popup minWidth={250}>
        <div className="space-y-3 p-1">
          <h3 className="font-semibold text-base text-foreground">{city.name}</h3>
          <div className="space-y-2">
            <Input
              placeholder="Digite seu nome"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
              className="text-sm"
            />
            <Input
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit()
              }}
              className="text-sm"
            />
            <Button
              onClick={handleSubmit}
              disabled={!author.trim() || !inputValue.trim() || isSubmitting}
              size="sm"
              className="w-full"
            >
              Enviar Mensagem
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function MapComponent({ onMessageSubmit }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMapReady = () => {
    mapRef.current?.invalidateSize()
    if (mapKey === 0) {
      setMapKey(1)
    }
  }

  if (!isMounted) {
    return (
      <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    )
  }

  // Centro do Espírito Santo
  const center: [number, number] = [-19.8, -40.5]

  return (
    <div className="w-full rounded-xl z-0 overflow-hidden" style={{ minHeight: 500 }}>
      <MapContainer
        ref={mapRef}
        key={mapKey}
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        whenReady={handleMapReady}
        className="h-[700px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {espiritoSantoCities.map((city) => (
          <CityMarker key={city.name} city={city} onMessageSubmit={onMessageSubmit} />
        ))}
      </MapContainer>
    </div>
  )
}
