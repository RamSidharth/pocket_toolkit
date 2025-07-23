"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [strength, setStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [userPassword, setUserPassword] = useState("")

  // Load saved state from localStorage
  useEffect(() => {
    const savedLength = localStorage.getItem("passwordLength")
    const savedIncludeUppercase = localStorage.getItem("passwordIncludeUppercase")
    const savedIncludeLowercase = localStorage.getItem("passwordIncludeLowercase")
    const savedIncludeNumbers = localStorage.getItem("passwordIncludeNumbers")
    const savedIncludeSymbols = localStorage.getItem("passwordIncludeSymbols")
    const savedUserPassword = localStorage.getItem("userPassword")

    if (savedLength) setLength(Number.parseInt(savedLength))
    if (savedIncludeUppercase) setIncludeUppercase(savedIncludeUppercase === "true")
    if (savedIncludeLowercase) setIncludeLowercase(savedIncludeLowercase === "true")
    if (savedIncludeNumbers) setIncludeNumbers(savedIncludeNumbers === "true")
    if (savedIncludeSymbols) setIncludeSymbols(savedIncludeSymbols === "true")
    if (savedUserPassword) setUserPassword(savedUserPassword)

    generatePassword()
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("passwordLength", length.toString())
    localStorage.setItem("passwordIncludeUppercase", includeUppercase.toString())
    localStorage.setItem("passwordIncludeLowercase", includeLowercase.toString())
    localStorage.setItem("passwordIncludeNumbers", includeNumbers.toString())
    localStorage.setItem("passwordIncludeSymbols", includeSymbols.toString())
    localStorage.setItem("userPassword", userPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, userPassword])

  useEffect(() => {
    calculatePasswordStrength()
  }, [password])

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
    const numberChars = "0123456789"
    const symbolChars = "!@#$%^&*()_-+=<>?"

    let chars = ""
    if (includeUppercase) chars += uppercaseChars
    if (includeLowercase) chars += lowercaseChars
    if (includeNumbers) chars += numberChars
    if (includeSymbols) chars += symbolChars

    // Fallback if no character set is selected
    if (!chars) {
      chars = lowercaseChars
      setIncludeLowercase(true)
    }

    let generatedPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      generatedPassword += chars[randomIndex]
    }

    setPassword(generatedPassword)
  }

  const calculatePasswordStrength = () => {
    if (!password) {
      setStrength(0)
      return
    }

    // Calculate password strength based on various factors
    let score = 0

    // Length factor (up to 40 points)
    score += Math.min(password.length * 2.5, 40)

    // Character variety factors
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSymbols = /[^A-Za-z0-9]/.test(password)

    if (hasUppercase) score += 15
    if (hasLowercase) score += 15
    if (hasNumbers) score += 15
    if (hasSymbols) score += 15

    setStrength(Math.min(score, 100))
  }

  const getStrengthLabel = () => {
    if (strength < 30) return "Very Weak"
    if (strength < 50) return "Weak"
    if (strength < 70) return "Moderate"
    if (strength < 90) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500"
    if (strength < 50) return "bg-orange-500"
    if (strength < 70) return "bg-yellow-500"
    if (strength < 90) return "bg-green-500"
    return "bg-emerald-500"
  }

  const handleCopy = () => {
    if (password) {
      try {
        navigator.clipboard.writeText(password)
      } catch (error) {
        console.error("Copy failed:", error)
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = password
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
    }
  }

  const checkUserPassword = () => {
    if (!userPassword) {
      setPassword("")
      setStrength(0)
      return
    }

    setPassword(userPassword)
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Password Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Generated Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                readOnly
                className="pr-10 font-mono bg-gray-800 border-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button onClick={generatePassword} className="bg-purple-600 hover:bg-purple-700 flex-1 py-2 h-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-gray-700 bg-gray-800 hover:bg-gray-700 flex-1 py-2 h-auto"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password-length">Length: {length}</Label>
            </div>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <Label>Include Characters:</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                />
                <Label htmlFor="include-uppercase" className="cursor-pointer">
                  Uppercase (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(!!checked)}
                />
                <Label htmlFor="include-lowercase" className="cursor-pointer">
                  Lowercase (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                />
                <Label htmlFor="include-numbers" className="cursor-pointer">
                  Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                />
                <Label htmlFor="include-symbols" className="cursor-pointer">
                  Symbols (!@#$%)
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="user-password">Check Your Own Password</Label>
            <div className="relative">
              <Input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Enter your password to check strength"
                className="pr-10 font-mono bg-gray-800 border-gray-700"
              />
            </div>
            <Button onClick={checkUserPassword} className="w-full bg-purple-600 hover:bg-purple-700 py-2 h-auto">
              Check Password Strength
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Password Strength</Label>
            <Progress value={strength} className="h-2" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              <div className={`h-full ${getStrengthColor()}`} style={{ width: `${strength}%` }}></div>
            </Progress>
            <div className="flex justify-between text-sm">
              <span className={strength < 30 ? "text-red-500" : "text-gray-400"}>Very Weak</span>
              <span className={strength >= 30 && strength < 50 ? "text-orange-500" : "text-gray-400"}>Weak</span>
              <span className={strength >= 50 && strength < 70 ? "text-yellow-500" : "text-gray-400"}>Moderate</span>
              <span className={strength >= 70 && strength < 90 ? "text-green-500" : "text-gray-400"}>Strong</span>
              <span className={strength >= 90 ? "text-emerald-500" : "text-gray-400"}>Very Strong</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <h3 className="font-medium">
              Password Strength:{" "}
              <span className={getStrengthColor().replace("bg-", "text-")}>{getStrengthLabel()}</span>
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">Your password should:</p>
              <ul className="text-sm space-y-1">
                <li className={`flex items-center ${password.length >= 12 ? "text-green-500" : "text-gray-400"}`}>
                  <span className="mr-2">{password.length >= 12 ? "✓" : "○"}</span>
                  Be at least 12 characters long
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                  <span className="mr-2">{/[A-Z]/.test(password) ? "✓" : "○"}</span>
                  Include uppercase letters
                </li>
                <li className={`flex items-center ${/[a-z]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                  <span className="mr-2">{/[a-z]/.test(password) ? "✓" : "○"}</span>
                  Include lowercase letters
                </li>
                <li className={`flex items-center ${/[0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`}>
                  <span className="mr-2">{/[0-9]/.test(password) ? "✓" : "○"}</span>
                  Include numbers
                </li>
                <li
                  className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`}
                >
                  <span className="mr-2">{/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}</span>
                  Include special characters
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-2">Password Tips</h3>
            <ul className="text-sm space-y-1 text-gray-400">
              <li>• Don't reuse passwords across multiple sites</li>
              <li>• Consider using a password manager</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• Change your passwords periodically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

