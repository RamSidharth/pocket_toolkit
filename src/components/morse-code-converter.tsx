"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Play, Copy, RotateCcw } from "lucide-react"

const morseCodeMap: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
}

// Reverse the morse code map for decoding
const reverseMorseCodeMap: Record<string, string> = Object.entries(morseCodeMap).reduce(
  (acc, [char, morse]) => ({ ...acc, [morse]: char }),
  {},
)

export default function MorseCodeConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  // Load saved state from localStorage
  useEffect(() => {
    const savedInput = localStorage.getItem("morseInput")
    const savedOutput = localStorage.getItem("morseOutput")
    const savedMode = localStorage.getItem("morseMode") as "encode" | "decode" | null

    if (savedInput) setInput(savedInput)
    if (savedOutput) setOutput(savedOutput)
    if (savedMode) setMode(savedMode)
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("morseInput", input)
    localStorage.setItem("morseOutput", output)
    localStorage.setItem("morseMode", mode)
  }, [input, output, mode])

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    if (mode === "encode") {
      // Text to Morse
      const result = input
        .toUpperCase()
        .split("")
        .map((char) => morseCodeMap[char] || char)
        .join(" ")
      setOutput(result)
    } else {
      // Morse to Text
      const result = input
        .trim()
        .split(" ")
        .map((code) => reverseMorseCodeMap[code] || code)
        .join("")
      setOutput(result)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
  }

  const handleCopy = () => {
    if (output) {
      try {
        navigator.clipboard.writeText(output)
      } catch (error) {
        console.error("Copy failed:", error)
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = output
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
    }
  }

  const playMorseCode = () => {
    if (!output || mode === "decode") return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const dotDuration = 100 // milliseconds
      const dashDuration = dotDuration * 3
      const pauseBetweenSymbols = dotDuration
      const pauseBetweenLetters = dotDuration * 3
      const pauseBetweenWords = dotDuration * 7

      let startTime = audioContext.currentTime + 0.1

      const playTone = (duration: number, time: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = "sine"
        oscillator.frequency.value = 700

        gainNode.gain.value = 0.5

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start(time)
        oscillator.stop(time + duration / 1000)
      }

      for (const char of output) {
        if (char === ".") {
          playTone(dotDuration, startTime)
          startTime += dotDuration / 1000
        } else if (char === "-") {
          playTone(dashDuration, startTime)
          startTime += dashDuration / 1000
        } else if (char === " ") {
          startTime += pauseBetweenLetters / 1000
        } else if (char === "/") {
          startTime += pauseBetweenWords / 1000
        }

        if (char !== " " && char !== "/") {
          startTime += pauseBetweenSymbols / 1000
        }
      }
    } catch (error) {
      console.error("Audio playback failed:", error)
    }
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Morse Code Converter</h2>

      <div className="flex items-center space-x-2 mb-6">
        <Switch
          id="mode-switch"
          checked={mode === "decode"}
          onCheckedChange={(checked) => setMode(checked ? "decode" : "encode")}
        />
        <Label htmlFor="mode-switch">{mode === "encode" ? "Text to Morse Code" : "Morse Code to Text"}</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="input">{mode === "encode" ? "Enter Text" : "Enter Morse Code"}</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type text to convert to Morse code..."
                : "Type Morse code (dots, dashes and spaces)..."
            }
            className="min-h-[150px] bg-gray-800 border-gray-700"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleConvert} className="bg-purple-600 hover:bg-purple-700 flex-1 py-2 h-auto">
              Convert
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 flex-1 py-2 h-auto bg-gray-800 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="output">{mode === "encode" ? "Morse Code" : "Text"}</Label>
          <Textarea id="output" value={output} readOnly className="min-h-[150px] bg-gray-800 border-gray-700" />
          <div className="flex flex-wrap gap-2">
            {mode === "encode" && (
              <Button
                onClick={playMorseCode}
                variant="outline"
                disabled={!output}
                className="border-gray-700 hover:bg-gray-800 flex-1 py-2 h-auto bg-gray-800 hover:bg-gray-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Sound
              </Button>
            )}
            <Button
              onClick={handleCopy}
              variant="outline"
              disabled={!output}
              className="border-gray-700 hover:bg-gray-800 flex-1 py-2 h-auto bg-gray-800 hover:bg-gray-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-medium mb-2">Morse Code Reference</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs md:text-sm overflow-y-auto max-h-[200px] pr-1">
          {Object.entries(morseCodeMap)
            .filter(([char]) => char !== " ")
            .map(([char, code]) => (
              <div key={char} className="flex items-center space-x-2">
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">{char}</span>
                <span className="text-gray-400">{code}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

