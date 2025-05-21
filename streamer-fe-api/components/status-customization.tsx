"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Clock, Smile } from "lucide-react"

type StatusCustomizationProps = {
  status: "online" | "offline" | "away"
  customStatus?: string
  onStatusChange: (status: "online" | "offline" | "away") => void
  onCustomStatusChange: (customStatus: string) => void
  onClose?: () => void
}

export function StatusCustomization({
  status,
  customStatus,
  onStatusChange,
  onCustomStatusChange,
  onClose,
}: StatusCustomizationProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [statusText, setStatusText] = useState(customStatus || "")
  const [showDialog, setShowDialog] = useState(!!onClose)

  const handleStatusChange = (value: string) => {
    setCurrentStatus(value as "online" | "offline" | "away")
    onStatusChange(value as "online" | "offline" | "away")
  }

  const handleCustomStatusChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatusText(e.target.value)
  }

  const handleSave = () => {
    onStatusChange(currentStatus)
    onCustomStatusChange(statusText)
    if (onClose) {
      onClose()
    }
  }

  const statusOptions = [
    { value: "online", label: "Online", color: "bg-green-500" },
    { value: "away", label: "Away", color: "bg-yellow-500" },
    { value: "offline", label: "Offline", color: "bg-gray-500" },
  ]

  const statusDisplay = (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          currentStatus === "online" ? "bg-green-500" : currentStatus === "away" ? "bg-yellow-500" : "bg-gray-500",
        )}
      />
      <span className="text-xs text-muted-foreground">
        {currentStatus === "online" ? "Online" : currentStatus === "away" ? "Away" : "Offline"}
      </span>
      {statusText && (
        <>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{statusText}</span>
        </>
      )}
      {!onClose && (
        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setShowDialog(true)}>
          <Smile className="h-3 w-3" />
        </Button>
      )}
    </div>
  )

  const statusContent = (
    <div className="space-y-4">
      <RadioGroup value={currentStatus} onValueChange={handleStatusChange} className="flex flex-col space-y-2">
        {statusOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
              <div className={cn("h-3 w-3 rounded-full", option.color)} />
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="custom-status">Custom Status</Label>
        <div className="relative">
          <Textarea
            id="custom-status"
            placeholder="What's on your mind?"
            value={statusText}
            onChange={handleCustomStatusChange}
            className="resize-none pr-8"
            maxLength={50}
          />
          <div className="absolute right-2 bottom-2 flex items-center">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-right">{statusText.length}/50</p>
      </div>

      <div className="space-y-2">
        <Label>Quick Status</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { emoji: "💻", text: "Working" },
            { emoji: "🍽️", text: "Lunch break" },
            { emoji: "🎮", text: "Gaming" },
            { emoji: "🏃", text: "Be right back" },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start"
              onClick={() => setStatusText(`${item.emoji} ${item.text}`)}
            >
              <span className="mr-2">{item.emoji}</span>
              {item.text}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Your status will automatically reset to Online after 24 hours</p>
      </div>
    </div>
  )

  if (!showDialog) {
    return statusDisplay
  }

  return (
    <Dialog
      open={showDialog}
      onOpenChange={(open) => {
        setShowDialog(open)
        if (!open && onClose) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Status</DialogTitle>
          <DialogDescription>Let others know if you're available or away.</DialogDescription>
        </DialogHeader>

        {statusContent}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (onClose) onClose()
              else setShowDialog(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
