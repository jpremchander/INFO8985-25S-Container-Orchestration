"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, MessageSquareHeart, Users, Moon, Sun } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

type TopNavigationProps = {
  user: {
    id: string
    email: string
    name: string
    avatar: string
    status: "online" | "offline" | "away"
  } | null
  onCreateGroup: () => void
  onProfileClick: () => void
}

export function TopNavigation({ user, onCreateGroup, onProfileClick }: TopNavigationProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const { theme, setTheme } = useTheme()

  const clearNotifications = () => {
    setUnreadNotifications(0)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-primary font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <MessageSquareHeart className="h-5 w-5" />
            </div>
            SecureChat
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user && (
            <>
              <Button variant="outline" size="sm" onClick={onCreateGroup}>
                <Users className="h-4 w-4 mr-2" />
                New Group
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <Badge
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                        variant="destructive"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" onClick={clearNotifications}>
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div>
                        <p className="font-medium">Security Alert</p>
                        <p className="text-sm text-muted-foreground">Your account was accessed from a new device</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div>
                        <p className="font-medium">New Feature Available</p>
                        <p className="text-sm text-muted-foreground">Try our new file encryption feature</p>
                        <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer">
                      <div>
                        <p className="font-medium">System Maintenance</p>
                        <p className="text-sm text-muted-foreground">Scheduled maintenance on June 15th</p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* User profile button */}
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={onProfileClick}>
            {user ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
