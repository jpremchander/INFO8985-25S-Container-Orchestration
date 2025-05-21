"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, Calendar, Clock, Users, User, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type HistorySidebarProps = {
  isOpen: boolean
  onClose: () => void
  onSelectChat: (chatId: string) => void
  activeChat: string | null
}

type ChatHistory = {
  id: string
  name: string
  preview: string
  date: Date
  unread?: boolean
  isGroup: boolean
  participants: {
    id: string
    name: string
    avatar: string
    status: "online" | "offline" | "away"
  }[]
}

export function HistorySidebar({ isOpen, onClose, onSelectChat, activeChat }: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "week">("all")
  const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats")

  // Mock chat history data
  const chatHistory: ChatHistory[] = [
    {
      id: "chat-1",
      name: "Network Security Discussion",
      preview: "Let's discuss the latest security protocols...",
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unread: true,
      isGroup: false,
      participants: [
        {
          id: "user-2",
          name: "Alice Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
          status: "online",
        },
      ],
    },
    {
      id: "chat-2",
      name: "Cloud Migration Planning",
      preview: "We need to finalize the AWS migration timeline...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isGroup: false,
      participants: [
        {
          id: "user-3",
          name: "Bob Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
          status: "offline",
        },
      ],
    },
    {
      id: "chat-3",
      name: "DevOps Team",
      preview: "Let's optimize our cluster resources...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isGroup: true,
      participants: [
        {
          id: "user-4",
          name: "Carol Williams",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
          status: "away",
        },
        {
          id: "user-5",
          name: "Dave Brown",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
          status: "online",
        },
        {
          id: "user-6",
          name: "Eve Davis",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
          status: "online",
        },
      ],
    },
    {
      id: "chat-4",
      name: "API Gateway Implementation",
      preview: "We should discuss the API gateway options...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      isGroup: false,
      participants: [
        {
          id: "user-7",
          name: "Frank Miller",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
          status: "online",
        },
      ],
    },
    {
      id: "chat-5",
      name: "Security Team",
      preview: "New vulnerability found in our system...",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      isGroup: true,
      participants: [
        {
          id: "user-8",
          name: "Grace Lee",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
          status: "online",
        },
        {
          id: "user-9",
          name: "Henry Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
          status: "offline",
        },
      ],
    },
  ]

  // Filter chats based on search query, time filter, and tab
  const filteredChats = chatHistory.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Filter by tab (chats or groups)
    if (activeTab === "chats" && chat.isGroup) return false
    if (activeTab === "groups" && !chat.isGroup) return false

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    if (activeFilter === "today") {
      return chat.date >= today
    } else if (activeFilter === "week") {
      return chat.date >= weekAgo
    }

    return true
  })

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date >= yesterday) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm border-r shadow-lg">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Chat History</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="chats"
          className="mb-4"
          onValueChange={(value) => setActiveTab(value as "chats" | "groups")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Direct
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={activeFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("today")}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Button
            variant={activeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("week")}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Week
          </Button>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4">
          <div className="space-y-2">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={cn(
                    "w-full text-left p-3 rounded-lg hover:bg-muted transition-colors",
                    chat.unread && "bg-primary/5 border-l-4 border-primary pl-2",
                    activeChat === chat.id && "bg-muted border-l-4 border-primary pl-2",
                  )}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex gap-3">
                    {chat.isGroup ? (
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <div className="absolute top-0 left-0 h-7 w-7 rounded-full overflow-hidden border-2 border-background">
                          <Avatar>
                            <AvatarImage src={chat.participants[0].avatar || "/placeholder.svg"} />
                            <AvatarFallback>{chat.participants[0].name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full overflow-hidden border-2 border-background">
                          <Avatar>
                            <AvatarImage src={chat.participants[1]?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{chat.participants[1]?.name.charAt(0) || "+"}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex-shrink-0">
                        <Avatar>
                          <AvatarImage src={chat.participants[0].avatar || "/placeholder.svg"} />
                          <AvatarFallback>{chat.participants[0].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            chat.participants[0].status === "online"
                              ? "bg-green-500"
                              : chat.participants[0].status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500",
                          )}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={cn("font-medium truncate", chat.unread && "text-primary font-semibold")}>
                          {chat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDate(chat.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations found</p>
                <p className="text-sm">Try a different search or filter</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4">
          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
