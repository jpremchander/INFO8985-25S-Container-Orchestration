"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Bell, MessageSquare, AtSign, Users, Volume2, Mail } from "lucide-react"

type NotificationPreferencesProps = {
  preferences: {
    all: boolean
    mentions: boolean
    directMessages: boolean
    groupMessages: boolean
    sounds: boolean
    emailNotifications: boolean
  }
  onClose: () => void
  onSave: (preferences: {
    all: boolean
    mentions: boolean
    directMessages: boolean
    groupMessages: boolean
    sounds: boolean
    emailNotifications: boolean
  }) => void
}

export function NotificationPreferences({ preferences, onClose, onSave }: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState(preferences)

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    onSave(prefs)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>Customize how and when you receive notifications.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="all-notifications" className="text-base">
                  All Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
              </div>
            </div>
            <Switch id="all-notifications" checked={prefs.all} onCheckedChange={() => handleToggle("all")} />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Notification Types</h4>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="mentions" className="text-sm">
                  Mentions
                </Label>
              </div>
              <Switch
                id="mentions"
                checked={prefs.mentions}
                onCheckedChange={() => handleToggle("mentions")}
                disabled={!prefs.all}
              />
            </div>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="direct-messages" className="text-sm">
                  Direct Messages
                </Label>
              </div>
              <Switch
                id="direct-messages"
                checked={prefs.directMessages}
                onCheckedChange={() => handleToggle("directMessages")}
                disabled={!prefs.all}
              />
            </div>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="group-messages" className="text-sm">
                  Group Messages
                </Label>
              </div>
              <Switch
                id="group-messages"
                checked={prefs.groupMessages}
                onCheckedChange={() => handleToggle("groupMessages")}
                disabled={!prefs.all}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Notification Methods</h4>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sounds" className="text-sm">
                  Notification Sounds
                </Label>
              </div>
              <Switch
                id="sounds"
                checked={prefs.sounds}
                onCheckedChange={() => handleToggle("sounds")}
                disabled={!prefs.all}
              />
            </div>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications" className="text-sm">
                  Email Notifications
                </Label>
              </div>
              <Switch
                id="email-notifications"
                checked={prefs.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
                disabled={!prefs.all}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
