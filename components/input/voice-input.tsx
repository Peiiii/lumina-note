"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/utils/performance-monitor"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function VoiceInput({
  onTranscript,
  className,
  placeholder = "Tap to speak...",
  disabled = false,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US" // Default language

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptText = result[0].transcript

        setTranscript(transcriptText)

        // If this is a final result
        if (result.isFinal) {
          setIsProcessing(true)

          // Process the transcript (e.g., clean up, format)
          setTimeout(() => {
            onTranscript(transcriptText)
            setIsProcessing(false)
            setTranscript("")
          }, 500)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)

        if (event.error === "not-allowed") {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          })
        }
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if we're still supposed to be listening
          recognitionRef.current.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, toast, isListening])

  const toggleListening = () => {
    if (disabled) return

    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      trackEvent("voice_input", "stop")
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
        trackEvent("voice_input", "start")
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
        toast({
          title: "Error",
          description: "Failed to start voice input. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Detect language from browser settings
  useEffect(() => {
    if (recognitionRef.current && navigator.language) {
      recognitionRef.current.lang = navigator.language
    }
  }, [])

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full transition-all",
          isListening && "animate-pulse",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {transcript && <div className="mt-2 p-2 bg-muted rounded-md text-sm max-w-xs text-center">{transcript}</div>}

      {!transcript && !isListening && <span className="mt-1 text-xs text-muted-foreground">{placeholder}</span>}

      {isListening && !transcript && (
        <div className="mt-2 flex space-x-1">
          <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      )}
    </div>
  )
}
