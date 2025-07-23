"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

type ConversionCategory = "length" | "weight" | "temperature" | "volume"

interface ConversionUnit {
  name: string
  value: string
  conversionFactor: number
}

const conversionUnits: Record<ConversionCategory, ConversionUnit[]> = {
  length: [
    { name: "Millimeters", value: "mm", conversionFactor: 0.001 },
    { name: "Centimeters", value: "cm", conversionFactor: 0.01 },
    { name: "Meters", value: "m", conversionFactor: 1 },
    { name: "Kilometers", value: "km", conversionFactor: 1000 },
    { name: "Inches", value: "in", conversionFactor: 0.0254 },
    { name: "Feet", value: "ft", conversionFactor: 0.3048 },
    { name: "Yards", value: "yd", conversionFactor: 0.9144 },
    { name: "Miles", value: "mi", conversionFactor: 1609.344 },
  ],
  weight: [
    { name: "Milligrams", value: "mg", conversionFactor: 0.000001 },
    { name: "Grams", value: "g", conversionFactor: 0.001 },
    { name: "Kilograms", value: "kg", conversionFactor: 1 },
    { name: "Metric Tons", value: "t", conversionFactor: 1000 },
    { name: "Ounces", value: "oz", conversionFactor: 0.0283495 },
    { name: "Pounds", value: "lb", conversionFactor: 0.453592 },
    { name: "Stone", value: "st", conversionFactor: 6.35029 },
    { name: "US Tons", value: "ton", conversionFactor: 907.185 },
  ],
  temperature: [
    { name: "Celsius", value: "c", conversionFactor: 0 }, // Special case
    { name: "Fahrenheit", value: "f", conversionFactor: 0 }, // Special case
    { name: "Kelvin", value: "k", conversionFactor: 0 }, // Special case
  ],
  volume: [
    { name: "Milliliters", value: "ml", conversionFactor: 0.000001 },
    { name: "Liters", value: "l", conversionFactor: 0.001 },
    { name: "Cubic Meters", value: "m3", conversionFactor: 1 },
    { name: "Fluid Ounces", value: "fl-oz", conversionFactor: 0.0000295735 },
    { name: "Cups", value: "cup", conversionFactor: 0.000236588 },
    { name: "Pints", value: "pt", conversionFactor: 0.000473176 },
    { name: "Quarts", value: "qt", conversionFactor: 0.000946353 },
    { name: "Gallons", value: "gal", conversionFactor: 0.00378541 },
  ],
}

export default function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>("length")
  const [fromValue, setFromValue] = useState<string>("1")
  const [fromUnit, setFromUnit] = useState<string>("m")
  const [toUnit, setToUnit] = useState<string>("cm")
  const [result, setResult] = useState<string>("")

  // Load saved state from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem("unitCategory") as ConversionCategory
    const savedFromValue = localStorage.getItem("unitFromValue")
    const savedFromUnit = localStorage.getItem("unitFromUnit")
    const savedToUnit = localStorage.getItem("unitToUnit")

    if (savedCategory) setCategory(savedCategory)
    if (savedFromValue) setFromValue(savedFromValue)
    if (savedFromUnit) setFromUnit(savedFromUnit)
    if (savedToUnit) setToUnit(savedToUnit)
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("unitCategory", category)
    localStorage.setItem("unitFromValue", fromValue)
    localStorage.setItem("unitFromUnit", fromUnit)
    localStorage.setItem("unitToUnit", toUnit)
  }, [category, fromValue, fromUnit, toUnit])

  useEffect(() => {
    convert()
  }, [fromValue, fromUnit, toUnit, category])

  const convert = () => {
    if (!fromValue || isNaN(Number(fromValue))) {
      setResult("")
      return
    }

    const value = Number.parseFloat(fromValue)

    // Special case for temperature
    if (category === "temperature") {
      let resultValue: number

      // Convert to Kelvin first (as intermediate)
      let kelvin: number

      if (fromUnit === "c") {
        kelvin = value + 273.15
      } else if (fromUnit === "f") {
        kelvin = (value + 459.67) * (5 / 9)
      } else {
        kelvin = value
      }

      // Convert from Kelvin to target unit
      if (toUnit === "c") {
        resultValue = kelvin - 273.15
      } else if (toUnit === "f") {
        resultValue = kelvin * (9 / 5) - 459.67
      } else {
        resultValue = kelvin
      }

      setResult(resultValue.toFixed(6).replace(/\.?0+$/, ""))
      return
    }

    // For other units, use conversion factors
    const fromUnitData = conversionUnits[category].find((u) => u.value === fromUnit)
    const toUnitData = conversionUnits[category].find((u) => u.value === toUnit)

    if (!fromUnitData || !toUnitData) {
      setResult("")
      return
    }

    // Convert to base unit, then to target unit
    const baseValue = value * fromUnitData.conversionFactor
    const resultValue = baseValue / toUnitData.conversionFactor

    setResult(resultValue.toFixed(6).replace(/\.?0+$/, ""))
  }

  // Handle category change with proper unit defaults
  const handleCategoryChange = (value: string) => {
    const newCategory = value as ConversionCategory
    setCategory(newCategory)

    // Set default units for the new category
    if (newCategory === "length") {
      setFromUnit("m")
      setToUnit("cm")
    } else if (newCategory === "weight") {
      setFromUnit("kg")
      setToUnit("g")
    } else if (newCategory === "temperature") {
      setFromUnit("c")
      setToUnit("f")
    } else if (newCategory === "volume") {
      setFromUnit("l")
      setToUnit("ml")
    }
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Unit Converter</h2>

      <Tabs value={category} onValueChange={handleCategoryChange} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4 md:mb-6 bg-gray-800">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temp</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Improved mobile layout */}
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="space-y-4">
            <Label htmlFor="from-value" className="text-base font-medium text-white">
              From
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  id="from-value"
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:hover:bg-gray-700 [&::-webkit-outer-spin-button]:hover:bg-gray-700"
                  placeholder="Enter value"
                />
              </div>
              <div>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-[200px] overflow-y-auto">
                    {conversionUnits[category].map((unit) => (
                      <SelectItem key={unit.value} value={unit.value} className="focus:bg-purple-900 focus:text-white">
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="space-y-4">
            <Label htmlFor="to-value" className="text-base font-medium text-white">
              To
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  id="to-value"
                  type="text"
                  value={result}
                  readOnly
                  className="bg-gray-900 border-gray-700 text-white font-medium"
                />
              </div>
              <div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white max-h-[200px] overflow-y-auto">
                    {conversionUnits[category].map((unit) => (
                      <SelectItem key={unit.value} value={unit.value} className="focus:bg-purple-900 focus:text-white">
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="font-medium mb-2 text-white">Formula</h3>
          <p className="text-gray-400 text-sm">
            {category === "temperature"
              ? fromUnit === "c" && toUnit === "f"
                ? "°F = (°C × 9/5) + 32"
                : fromUnit === "f" && toUnit === "c"
                  ? "°C = (°F - 32) × 5/9"
                  : fromUnit === "c" && toUnit === "k"
                    ? "K = °C + 273.15"
                    : fromUnit === "k" && toUnit === "c"
                      ? "°C = K - 273.15"
                      : fromUnit === "f" && toUnit === "k"
                        ? "K = (°F + 459.67) × 5/9"
                        : fromUnit === "k" && toUnit === "f"
                          ? "°F = K × 9/5 - 459.67"
                          : "Direct conversion"
              : `1 ${conversionUnits[category].find((u) => u.value === fromUnit)?.name} = 
              ${
                (conversionUnits[category].find((u) => u.value === fromUnit)?.conversionFactor || 0) /
                (conversionUnits[category].find((u) => u.value === toUnit)?.conversionFactor || 1)
              } 
              ${conversionUnits[category].find((u) => u.value === toUnit)?.name}`}
          </p>
        </Card>
      </div>
    </div>
  )
}

