"use client"

import { useState } from "react"
import { Chat } from "@/components/chat"
import { HistorySidebar } from "@/components/history-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { NetworkBackground } from "@/components/network-background"
import { useMobile } from "@/hooks/use-mobile"
import { Menu, X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GroupChatModal } from "@/components/group-chat-modal"
import { UserProfileSidebar } from "@/components/user-profile-sidebar"

type User = {
  id: string
  email: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  customStatus?: string
  verified?: boolean
  phoneVerified?: boolean
  notificationPreferences?: {
    all: boolean
    mentions: boolean
    directMessages: boolean
    groupMessages: boolean
    sounds: boolean
    emailNotifications: boolean
  }
} | null

export function ChatInterface() {
  const [user, setUser] = useState<User>(null)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false)
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const isMobile = useMobile()

  const handleLogin = (email: string) => {
    // In a real app, you would fetch user data from your backend
    setUser({
      id: "user-1",
      email,
      name: email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      status: "online",
      verified: false,
      phoneVerified: false,
      customStatus: "",
      notificationPreferences: {
        all: true,
        mentions: true,
        directMessages: true,
        groupMessages: true,
        sounds: true,
        emailNotifications: false,
      },
    })
  }

  const handleLogout = () => {
    setUser(null)
    setActiveChat(null)
    setProfileSidebarOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId)
    if (isMobile) {
      setChatSidebarOpen(false)
    }
  }

  const toggleProfileSidebar = () => {
    setProfileSidebarOpen(!profileSidebarOpen)
    if (isMobile && profileSidebarOpen) {
      setChatSidebarOpen(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-screen relative overflow-hidden">
      {/* Network background */}
      <NetworkBackground />

      {/* Top navigation */}
      <TopNavigation user={user} onCreateGroup={() => setShowGroupModal(true)} onProfileClick={toggleProfileSidebar} />

      {/* Main content area with sidebars and chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat sidebar toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-20 left-4 z-50 bg-background/80 backdrop-blur-sm shadow-md"
          onClick={() => setChatSidebarOpen(!chatSidebarOpen)}
        >
          {chatSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Profile sidebar toggle button (mobile only) */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-20 right-4 z-50 bg-background/80 backdrop-blur-sm shadow-md"
            onClick={toggleProfileSidebar}
          >
            <UserCircle className="h-4 w-4" />
          </Button>
        )}

        {/* Chat history sidebar */}
        <div
          className={cn(
            "fixed inset-y-16 left-0 z-20 w-80 transition-transform duration-300 ease-in-out",
            chatSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <HistorySidebar
            isOpen={chatSidebarOpen}
            onClose={() => setChatSidebarOpen(false)}
            onSelectChat={handleSelectChat}
            activeChat={activeChat}
          />
        </div>

        {/* User profile sidebar */}
        <div
          className={cn(
            "fixed inset-y-16 right-0 z-20 w-80 transition-transform duration-300 ease-in-out",
            profileSidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <UserProfileSidebar
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onClose={() => setProfileSidebarOpen(false)}
          />
        </div>

        {/* Main chat area */}
        <div
          className={cn(
            "flex-1 overflow-hidden p-4 transition-all duration-300",
            chatSidebarOpen && !isMobile ? "ml-80" : "ml-0",
            profileSidebarOpen && !isMobile ? "mr-80" : "mr-0",
          )}
        >
          <div className="max-w-4xl mx-auto h-full">
            <Chat user={user} onLogin={handleLogin} activeChat={activeChat} />
          </div>
        </div>
      </div>

      {/* Group chat modal */}
      {showGroupModal && (
        <GroupChatModal
          onClose={() => setShowGroupModal(false)}
          onCreateGroup={(name) => {
            // In a real app, you would create the group in your backend
            console.log("Creating group:", name)
            setShowGroupModal(false)
          }}
        />
      )}
    </div>
  )
}
