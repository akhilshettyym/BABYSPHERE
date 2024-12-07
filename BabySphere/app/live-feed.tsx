"use client"

import { useState } from "react"
import { ArrowLeft, Maximize2, Minimize2, Pause, Play, Volume2, VolumeX, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LiveFeed() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [alert, setAlert] = useState<string | null>(null)

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className="relative h-screen bg-[#A3D8F4] text-[#8AA9B8]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <Button variant="ghost" size="icon" className="text-[#8AA9B8]">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Live Feed</h1>
        <div className={cn(
          "w-3 h-3 rounded-full",
          isConnected ? "bg-green-500" : "bg-red-500"
        )} />
      </div>

      {/* Video Feed */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          className="w-full h-full object-cover"
          src="/placeholder.mp4"
          autoPlay
          loop
          muted={isMuted}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 rounded-full p-4 flex space-x-4">
          <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white">
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alert && (
        <div className="absolute top-16 left-0 right-0 bg-[#FFF1C1] text-[#8AA9B8] py-2 px-4 text-center">
          {alert}
        </div>
      )}

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 z-10">
        <Button className="bg-[#FDC1C5] text-white hover:bg-[#FDC1C5]/90">
          <Camera className="h-5 w-5 mr-2" />
          Capture Snapshot
        </Button>
        <Button variant="outline" className="bg-[#8AA9B8] text-white hover:bg-[#8AA9B8]/90">
          Switch to History
        </Button>
      </div>
    </div>
  )
}

