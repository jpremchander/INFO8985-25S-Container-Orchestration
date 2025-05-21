"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileIcon, ImageIcon, X, Paperclip, Lock, LockOpen, Send, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/file-upload"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ChatUser = {
  id: string
  email: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
} | null

type MessageType = {
  id: string
  content: string
  isUser: boolean
  isHtml: boolean
  timestamp: Date
  isEncrypted?: boolean
  attachments?: Attachment[]
  status?: "sent" | "delivered" | "seen"
}

type Attachment = {
  id: string
  name: string
  type: string
  url: string
  size: number
}

type ChatProps = {
  user: ChatUser
  onLogin: (email: string) => void
  activeChat: string | null
}

// Mock data for chats
const MOCK_CHATS = {
  "chat-1": {
    id: "chat-1",
    name: "Network Security Discussion",
    participants: [
      {
        id: "user-2",
        name: "Alice Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        status: "online",
      },
    ],
    isGroup: false,
  },
  "chat-2": {
    id: "chat-2",
    name: "Cloud Migration Planning",
    participants: [
      {
        id: "user-3",
        name: "Bob Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        status: "offline",
      },
    ],
    isGroup: false,
  },
  "chat-3": {
    id: "chat-3",
    name: "DevOps Team",
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
    isGroup: true,
  },
}

export function Chat({ user, onLogin, activeChat }: ChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentChat = activeChat ? MOCK_CHATS[activeChat as keyof typeof MOCK_CHATS] : null

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load chat messages when active chat changes
  useEffect(() => {
    if (activeChat && user) {
      // In a real app, you would fetch messages from your backend
      setMessages([])

      // Simulate loading messages
      setIsLoading(true)
      setTimeout(() => {
        const mockMessages: MessageType[] = [
          {
            id: "msg-1",
            content: `Welcome to the ${MOCK_CHATS[activeChat as keyof typeof MOCK_CHATS].name} chat!`,
            isUser: false,
            isHtml: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: "seen",
          },
          {
            id: "msg-2",
            content: "Hi there! I have some questions about this topic.",
            isUser: true,
            isHtml: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            isEncrypted: true,
            status: "seen",
          },
          {
            id: "msg-3",
            content: "Sure, I'd be happy to help. What would you like to know?",
            isUser: false,
            isHtml: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
            status: "seen",
          },
        ]
        setMessages(mockMessages)
        setIsLoading(false)
      }, 1000)
    }
  }, [activeChat, user])

  // Simulate typing indicator
  useEffect(() => {
    if (input.length > 0 && user) {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set typing indicator after a short delay
      typingTimeoutRef.current = setTimeout(() => {
        // In a real app, you would send a typing event to your backend
        console.log("User is typing...")

        // Simulate response typing
        setTimeout(() => {
          setIsTyping(true)

          // Stop typing after a few seconds
          setTimeout(() => {
            setIsTyping(false)
          }, 3000)
        }, 1000)
      }, 500)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [input, user])

  const handleFileUpload = (files: File[]) => {
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
    setShowFileUpload(false)
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && attachments.length === 0) return

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      isHtml: false,
      timestamp: new Date(),
      isEncrypted: isEncrypted,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      status: "sent",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setAttachments([])
    setIsLoading(true)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update message status to delivered
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg)),
      )

      // Simulate typing delay
      setIsTyping(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsTyping(false)

      // Example response - in a real app, this would come from your API
      const isHtml = Math.random() > 0.5 // Randomly decide if response is HTML or plain text
      const responseContent = isHtml
        ? `<div style="color: blue; font-weight: bold;">This is an HTML response</div>
           <ul>
             <li>Item 1</li>
             <li>Item 2</li>
             <li>Item 3</li>
           </ul>`
        : `This is a response to: "${input}"`

      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        isHtml: isHtml,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Update message status to seen after a short delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "seen" as const } : msg)),
        )
      }, 1000)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Render message status indicator
  const renderMessageStatus = (status: "sent" | "delivered" | "seen" | undefined) => {
    if (!status) return null

    switch (status) {
      case "sent":
        return <div className="text-xs text-muted-foreground ml-2">✓</div>
      case "delivered":
        return <div className="text-xs text-muted-foreground ml-2">✓✓</div>
      case "seen":
        return <div className="text-xs text-primary ml-2">✓✓</div>
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden bg-background/80 backdrop-blur-sm border-slate-200/20 shadow-xl">
      {/* Chat header */}
      {currentChat && (
        <div className="p-3 border-b flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            {currentChat.isGroup ? (
              <div className="relative h-10 w-10">
                <div className="absolute top-0 left-0 h-7 w-7 rounded-full overflow-hidden border-2 border-background">
                  <Avatar>
                    <AvatarImage src={currentChat.participants[0].avatar || "/placeholder.svg"} />
                    <AvatarFallback>{currentChat.participants[0].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-0 right-0 h-7 w-7 rounded-full overflow-hidden border-2 border-background">
                  <Avatar>
                    <AvatarImage src={currentChat.participants[1]?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{currentChat.participants[1]?.name.charAt(0) || "+"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ) : (
              <Avatar>
                <AvatarImage src={currentChat.participants[0].avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentChat.participants[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="font-medium">{currentChat.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                {currentChat.isGroup ? (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {currentChat.participants.length} members
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mr-1",
                        currentChat.participants[0].status === "online"
                          ? "bg-green-500"
                          : currentChat.participants[0].status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500",
                      )}
                    />
                    {currentChat.participants[0].status === "online"
                      ? "Online"
                      : currentChat.participants[0].status === "away"
                        ? "Away"
                        : "Offline"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch id="encryption" checked={isEncrypted} onCheckedChange={setIsEncrypted} />
                    {isEncrypted ? (
                      <Lock className="h-4 w-4 text-green-500" />
                    ) : (
                      <LockOpen className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isEncrypted ? "End-to-end encryption enabled" : "Encryption disabled"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && !messages.length ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            {currentChat ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {currentChat.isGroup ? (
                    <Users className="h-8 w-8 text-primary" />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Start chatting with {currentChat.name}</h3>
                  <p className="text-sm">Your messages are {isEncrypted ? "encrypted" : "not encrypted"}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">Select a chat or start a new conversation</h3>
                  <p className="text-sm">Your messages will be {isEncrypted ? "encrypted" : "not encrypted"}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted mr-auto",
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!message.isUser && currentChat && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentChat.participants[0].avatar || "/placeholder.svg"} />
                      <AvatarFallback>{currentChat.participants[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {message.isEncrypted && <Lock className="h-3 w-3 text-green-500" />}
                  {message.isUser && renderMessageStatus(message.status)}
                </div>

                {message.isHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    className="prose prose-sm dark:prose-invert max-w-none"
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.id} className="relative">
                        {attachment.type.startsWith("image/") ? (
                          <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 rounded-md border bg-background">
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{(attachment.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="max-w-[80%] rounded-lg p-3 bg-muted mr-auto">
                <div className="flex items-center gap-2">
                  {currentChat && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentChat.participants[0].avatar || "/placeholder.svg"} />
                      <AvatarFallback>{currentChat.participants[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/70 animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <form onSubmit={handleSubmit} className="border-t p-4 space-y-4">
        {showFileUpload && <FileUpload onUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1 bg-background rounded-full pl-2 pr-1 py-1 text-sm border"
              >
                {file.type.startsWith("image/") ? <ImageIcon className="h-3 w-3" /> : <FileIcon className="h-3 w-3" />}
                <span className="max-w-[100px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  className="rounded-full hover:bg-muted p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowFileUpload(true)}
            disabled={isLoading || !user || !currentChat}
            className="rounded-full h-10 w-10 flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={user && currentChat ? "Type your message here..." : "Sign in to send messages"}
              className="min-h-[80px] resize-none pr-12"
              disabled={isLoading || !user || !currentChat}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !user || !currentChat || (!input.trim() && attachments.length === 0)}
              className="absolute bottom-2 right-2 rounded-full h-8 w-8"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
