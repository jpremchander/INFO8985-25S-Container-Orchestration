"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type GroupChatModalProps = {
  onClose: () => void
  onCreateGroup: (name: string) => void
}

// Mock user data
const MOCK_USERS = [
  {
    id: "user-2",
    name: "Alice Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    status: "online",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    status: "offline",
  },
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
  { id: "user-6", name: "Eve Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve", status: "online" },
  {
    id: "user-7",
    name: "Frank Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    status: "online",
  },
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
]

export function GroupChatModal({ onClose, onCreateGroup }: GroupChatModalProps) {
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredUsers = MOCK_USERS.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup(groupName)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Create a group chat with multiple participants.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Add Participants</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md">
                  {selectedUsers.map((userId) => {
                    const user = MOCK_USERS.find((u) => u.id === userId)
                    if (!user) return null

                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-1 bg-background rounded-full pl-2 pr-1 py-1 text-sm border"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="max-w-[100px] truncate">{user.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleUserSelection(user.id)}
                          className="rounded-full hover:bg-muted p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-2 space-y-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left",
                          selectedUsers.includes(user.id) && "bg-primary/10",
                        )}
                        onClick={() => toggleUserSelection(user.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                              user.status === "online"
                                ? "bg-green-500"
                                : user.status === "away"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500",
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.status === "online" ? "Online" : user.status === "away" ? "Away" : "Offline"}
                          </p>
                        </div>
                        {selectedUsers.includes(user.id) && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!groupName.trim() || selectedUsers.length === 0}>
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
