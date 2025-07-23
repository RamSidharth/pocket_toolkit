"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import QRCode from "qrcode"

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://ramsidharth.netlify.app")
  const [size, setSize] = useState(200)
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [qrCode, setQrCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Load saved state from localStorage
  useEffect(() => {
    const savedText = localStorage.getItem("qrText")
    const savedSize = localStorage.getItem("qrSize")
    const savedErrorCorrection = localStorage.getItem("qrErrorCorrection")

    if (savedText) setText(savedText)
    if (savedSize) setSize(Number.parseInt(savedSize))
    if (savedErrorCorrection) setErrorCorrection(savedErrorCorrection)

    generateQRCode()
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("qrText", text)
    localStorage.setItem("qrSize", size.toString())
    localStorage.setItem("qrErrorCorrection", errorCorrection)
  }, [text, size, errorCorrection])

  const generateQRCode = async () => {
    if (!text) return

    setIsGenerating(true)

    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        errorCorrectionLevel: errorCorrection as "L" | "M" | "Q" | "H",
        color: {
          dark: "#ffffff",
          light: "#000000",
        },
      })

      setQrCode(qrCodeDataURL)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Safe download function that avoids file system errors
  const handleDownload = () => {
    if (!qrCode) return

    try {
      // Create a temporary anchor element
      const link = document.createElement("a")
      link.href = qrCode
      link.download = "PocketToolKit-qrcode.png"

      // Append to body, click, and remove to avoid memory leaks
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback method - open in new tab
      window.open(qrCode, "_blank")
    }
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">QR Code Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="qr-text">Text or URL</Label>
            <Input
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL"
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="qr-size">Size: {size}px</Label>
            </div>
            <Slider
              id="qr-size"
              min={100}
              max={400}
              step={10}
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="error-correction">Error Correction</Label>
            <Select value={errorCorrection} onValueChange={setErrorCorrection}>
              <SelectTrigger id="error-correction" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select error correction level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateQRCode}
            disabled={!text || isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 h-auto"
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center bg-black rounded-lg p-6 border border-gray-800">
          {qrCode ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="max-w-full rounded-lg" />
              </div>
              <div className="flex justify-center">
                <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 w-full">
                  Download QR Code
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center">Enter text and click Generate to create your QR code</div>
          )}
        </div>
      </div>
    </div>
  )
}

