"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Phone, Loader2, RefreshCw } from "lucide-react"
import { Label } from "@/components/ui/label"

type VerificationModalProps = {
  type: "email" | "phone"
  email?: string
  onClose: () => void
  onVerify: () => void
}

export function VerificationModal({ type, email, onClose, onVerify }: VerificationModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [codeSent, setCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (codeSent && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [codeSent, timeLeft])

  const handleSendCode = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, you would send a verification code to the email or phone
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCodeSent(true)
      setTimeLeft(60)
    } catch (error) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setTimeLeft(60)
    handleSendCode()
  }

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (pastedData.length <= 6 && /^\d+$/.test(pastedData)) {
      const newCode = [...verificationCode]
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newCode[i] = pastedData[i]
      }
      setVerificationCode(newCode)
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join("")
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // In a real app, you would verify the code with your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll accept any 6-digit code
      onVerify()
    } catch (error) {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "email" ? "Verify Your Email" : "Add Phone Number"}</DialogTitle>
          <DialogDescription>
            {type === "email"
              ? "We'll send a verification code to your email address."
              : "Add your phone number for additional security and verification."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "phone" && !codeSent && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {type === "email" && !codeSent && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Verification Email</p>
                <p className="text-xs text-muted-foreground">We'll send a verification code to {email}</p>
              </div>
            </div>
          )}

          {codeSent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                {type === "email" ? (
                  <Mail className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Phone className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Verification Code Sent</p>
                  <p className="text-xs text-muted-foreground">
                    {type === "email"
                      ? `We've sent a 6-digit code to ${email}`
                      : `We've sent a 6-digit code to ${phoneNumber}`}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enter Verification Code</Label>
                <div className="flex justify-between gap-2">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-10 h-12 text-center text-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Didn't receive the code?"}
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={handleResendCode} disabled={timeLeft > 0}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Resend
                </Button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {codeSent ? (
            <Button onClick={handleVerify} disabled={isLoading || verificationCode.join("").length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          ) : (
            <Button onClick={handleSendCode} disabled={isLoading || (type === "phone" && !phoneNumber)}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
