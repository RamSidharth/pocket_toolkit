"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QRCodeGenerator from "@/components/qr-code-generator"
import UnitConverter from "@/components/unit-converter"
import MorseCodeConverter from "@/components/morse-code-converter"
import PasswordGenerator from "@/components/password-generator"
import { MoveUpRight, Wrench } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("qr-code")

  // Add useEffect to load saved state from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <Wrench className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Pocket Toolkit
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Four powerful tools in one sleek interface</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <FeatureTile
            title="QR Code Generator"
            description="Generate QR codes from any text or URL"
            isActive={activeTab === "qr-code"}
            onClick={() => setActiveTab("qr-code")}
          />
          <FeatureTile
            title="Unit Converter"
            description="Convert between various units of measurement"
            isActive={activeTab === "unit-converter"}
            onClick={() => setActiveTab("unit-converter")}
          />
          <FeatureTile
            title="Morse Code"
            description="Convert text to Morse code and vice versa"
            isActive={activeTab === "morse-code"}
            onClick={() => setActiveTab("morse-code")}
          />
          <FeatureTile
            title="Password Generator"
            description="Create strong, secure passwords instantly"
            isActive={activeTab === "password-generator"}
            onClick={() => setActiveTab("password-generator")}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="unit-converter">Unit Converter</TabsTrigger>
            <TabsTrigger value="morse-code">Morse Code</TabsTrigger>
            <TabsTrigger value="password-generator">Password Generator</TabsTrigger>
          </TabsList>

          <div className="bg-gray-900 rounded-xl p-4 md:p-6 shadow-lg border border-gray-800">
            <TabsContent value="qr-code" className="mt-0">
              <QRCodeGenerator />
            </TabsContent>
            <TabsContent value="unit-converter" className="mt-0">
              <UnitConverter />
            </TabsContent>
            <TabsContent value="morse-code" className="mt-0">
              <MorseCodeConverter />
            </TabsContent>
            <TabsContent value="password-generator" className="mt-0">
              <PasswordGenerator />
            </TabsContent>
          </div>
        </Tabs>
        <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            For further features and queries contact{" "}
            <a
              href="https://www.linkedin.com/in/ram-sidharth-4b97a0255"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              RamSidharth
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}

interface FeatureTileProps {
  title: string
  description: string
  isActive: boolean
  onClick: () => void
}

function FeatureTile({ title, description, isActive, onClick }: FeatureTileProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-3 md:p-6 cursor-pointer transition-all duration-300
        ${
          isActive
            ? "bg-gradient-to-br from-purple-900 to-pink-900 border-2 border-purple-500 shadow-lg shadow-purple-900/20"
            : "bg-gray-900 border border-gray-800 hover:bg-gray-800"
        }
      `}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-base md:text-xl font-bold mb-1 md:mb-2">{title}</h2>
        <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">{description}</p>
        <div className="mt-auto flex justify-end">
          <MoveUpRight
            className={`
            w-4 h-4 md:w-5 md:h-5 transition-all duration-300
            ${isActive ? "text-purple-300" : "text-gray-500"}
          `}
          />
        </div>
      </div>
    </div>
  )
}

