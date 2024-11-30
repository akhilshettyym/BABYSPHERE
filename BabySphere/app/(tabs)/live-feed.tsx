"use client"

import { useState, useEffect } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { OverlayButton } from "@/components/ui/overlay-button"
import { ArrowLeftIcon, PlayIcon, PauseIcon, VolumeIcon, MuteIcon, FullscreenIcon, MinimizeIcon, CameraIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const ButtonWrapper: React.FC<ButtonProps> = (props) => <Button {...props} />

export default function LiveFeed() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [alert, setAlert] = useState<string | null>(null)

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsConnected(navigator.onLine)
      setAlert(navigator.onLine ? null : "Connection Lost")
    }

    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)

    return () => {
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  }, [])

  const handleCaptureSnapshot = () => {
    setAlert("Snapshot captured!")
    setTimeout(() => setAlert(null), 3000)
  }

  return (
    <div className="relative h-screen bg-[#A3D8F4] text-[#8AA9B8]">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
        <ButtonWrapper variant="ghost" size="icon" className="text-[#8AA9B8]">
          <ArrowLeftIcon />
          <span className="sr-only">Back</span>
        </ButtonWrapper>
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
          playsInline
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-50 rounded-full p-2 flex space-x-2">
          <OverlayButton onClick={togglePlay} active={isPlaying}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
          </OverlayButton>
          <OverlayButton onClick={toggleMute} active={!isMuted}>
            {isMuted ? <MuteIcon /> : <VolumeIcon />}
            <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          </OverlayButton>
          <OverlayButton onClick={toggleFullscreen} active={isFullscreen}>
            {isFullscreen ? <MinimizeIcon /> : <FullscreenIcon />}
            <span className="sr-only">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
          </OverlayButton>
        </div>
      </div>

      {/* Alerts Section */}
      {alert && (
        <div 
          className="absolute top-16 left-0 right-0 bg-[#FFF1C1] text-[#8AA9B8] py-2 px-4 text-center text-sm animate-in slide-in-from-top duration-300"
          onClick={() => setAlert(null)}
        >
          {alert}
        </div>
      )}

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 z-10">
        <ButtonWrapper 
          className="bg-[#FDC1C5] text-white hover:bg-[#FDC1C5]/90"
          onClick={handleCaptureSnapshot}
        >
          <CameraIcon className="h-5 w-5 mr-2" />
          Capture Snapshot
        </ButtonWrapper>
        <ButtonWrapper variant="outline" className="bg-[#8AA9B8] text-white hover:bg-[#8AA9B8]/90">
          Switch to History
        </ButtonWrapper>
      </div>
    </div>
  )
}

