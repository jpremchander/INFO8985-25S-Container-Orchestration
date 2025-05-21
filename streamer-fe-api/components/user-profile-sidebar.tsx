"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Camera,
  LogOut,
  Lock,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Sun,
  Moon,
  Trash2,
  Check,
  Mail,
  Phone,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthModal } from "@/components/auth-modal"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { VerificationModal } from "@/components/verification-modal"
import { NotificationPreferences } from "@/components/notification-preferences"
import { StatusCustomization } from "@/components/status-customization"
import { AccountDeletion } from "@/components/account-deletion"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type UserProfile = {
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

type UserProfileSidebarProps = {
  user: UserProfile
  onLogin: (email: string) => void
  onLogout: () => void
  onClose: () => void
}

export function UserProfileSidebar({ user, onLogin, onLogout, onClose }: UserProfileSidebarProps) {
  const [showAuthModal, setShowAuthModal] = useState<"signin" | "signup" | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [showProfilePictureUpload, setShowProfilePictureUpload] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState<"email" | "phone" | null>(null)
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false)
  const [showStatusCustomization, setShowStatusCustomization] = useState(false)
  const [showAccountDeletion, setShowAccountDeletion] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    customStatus: user?.customStatus || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // In a real app, you would save the profile data to your backend
    console.log("Saving profile:", formData)
    setEditMode(false)
  }

  const handleProfilePictureClick = () => {
    setShowProfilePictureUpload(true)
  }

  const handleVerifyEmail = () => {
    setShowVerificationModal("email")
  }

  const handleVerifyPhone = () => {
    setShowVerificationModal("phone")
  }

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm border-l shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{user ? "My Profile" : "Account"}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {user ? (
          <div className="p-4">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 pt-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleProfilePictureClick}>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={handleProfilePictureClick}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      {user.verified && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Check className="h-4 w-4 text-green-500" />
                            </TooltipTrigger>
                            <TooltipContent>Verified Account</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center justify-center mt-1">
                      <StatusCustomization
                        status={user.status}
                        customStatus={user.customStatus}
                        onStatusChange={(status) => console.log("Status changed:", status)}
                        onCustomStatusChange={(customStatus) => console.log("Custom status changed:", customStatus)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {editMode ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customStatus">Custom Status</Label>
                      <Textarea
                        id="customStatus"
                        name="customStatus"
                        value={formData.customStatus}
                        onChange={handleInputChange}
                        placeholder="What's on your mind?"
                        className="resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Display Name</h4>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                      <div className="flex items-center gap-2">
                        <p>{user.email}</p>
                        {user.verified ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" onClick={handleVerifyEmail}>
                            Verify Email
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                      <div className="flex items-center gap-2">
                        <p>{user.phoneVerified ? "+1 (555) 123-4567" : "Not added"}</p>
                        {user.phoneVerified ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" onClick={handleVerifyPhone}>
                            Add Phone
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h4>
                      <p>Free Plan</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h4>
                      <p>May 21, 2025</p>
                    </div>
                    <Button onClick={() => setEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}

                <Separator />

                <Button variant="destructive" className="w-full" onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <Button variant="outline" size="sm" onClick={() => setShowNotificationPreferences(true)}>
                      Customize
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">All Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sounds">Message Sounds</Label>
                      <p className="text-sm text-muted-foreground">Play sounds for new messages</p>
                    </div>
                    <Switch id="sounds" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="read-receipts">Read Receipts</Label>
                      <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
                    </div>
                    <Switch id="read-receipts" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="encryption">End-to-End Encryption</Label>
                        <Lock className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">Enable encryption for all messages</p>
                    </div>
                    <Switch id="encryption" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="online-status">Online Status</Label>
                      <p className="text-sm text-muted-foreground">Show when you're online</p>
                    </div>
                    <Switch id="online-status" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appearance</h3>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Management</h3>
                  <Button variant="destructive" onClick={() => setShowAccountDeletion(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Password</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Email Verification</h4>
                    </div>
                    {user.verified ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <p className="text-sm">Your email is verified</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Verify your email for enhanced security</p>
                        <Button variant="outline" size="sm" onClick={handleVerifyEmail}>
                          Verify Email
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Phone Verification</h4>
                    </div>
                    {user.phoneVerified ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <p className="text-sm">Your phone is verified</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Add a phone number for additional security</p>
                        <Button variant="outline" size="sm" onClick={handleVerifyPhone}>
                          Add Phone Number
                        </Button>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Device</p>
                        <p className="text-xs text-muted-foreground">Windows • Chrome • New York, USA</p>
                      </div>
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Active Now</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">iPhone 13</p>
                        <p className="text-xs text-muted-foreground">iOS • Safari • New York, USA</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Login Alerts</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                    <div className="flex items-center space-x-2">
                      <Switch id="login-alerts" defaultChecked />
                      <Label htmlFor="login-alerts">Enable login alerts</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Moon className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Welcome to SecureChat</h3>
              <p className="text-muted-foreground">Sign in to access your account and start chatting securely.</p>
            </div>

            <div className="flex flex-col w-full gap-2">
              <Button onClick={() => setShowAuthModal("signin")}>Sign In</Button>
              <Button variant="outline" onClick={() => setShowAuthModal("signup")}>
                Create Account
              </Button>
            </div>

            <Separator />

            <div className="w-full space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">End-to-End Encryption</h4>
                  <p className="text-sm text-muted-foreground">Your messages are secure and private</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Advanced Security</h4>
                  <p className="text-sm text-muted-foreground">Protected with industry-leading security</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Free to Use</h4>
                  <p className="text-sm text-muted-foreground">Basic features are always free</p>
                </div>
              </div>
            </div>

            <div className="w-full pt-4">
              <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {showAuthModal && (
        <AuthModal
          mode={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          onSuccess={(email) => {
            onLogin(email)
            setShowAuthModal(null)
          }}
        />
      )}

      {showProfilePictureUpload && (
        <ProfilePictureUpload
          currentAvatar={user?.avatar || ""}
          onClose={() => setShowProfilePictureUpload(false)}
          onSave={(imageUrl) => {
            console.log("New profile picture:", imageUrl)
            setShowProfilePictureUpload(false)
          }}
        />
      )}

      {showVerificationModal && (
        <VerificationModal
          type={showVerificationModal}
          email={user?.email || ""}
          onClose={() => setShowVerificationModal(null)}
          onVerify={() => {
            console.log(`${showVerificationModal} verified successfully`)
            setShowVerificationModal(null)
          }}
        />
      )}

      {showNotificationPreferences && (
        <NotificationPreferences
          preferences={
            user?.notificationPreferences || {
              all: true,
              mentions: true,
              directMessages: true,
              groupMessages: true,
              sounds: true,
              emailNotifications: false,
            }
          }
          onClose={() => setShowNotificationPreferences(false)}
          onSave={(preferences) => {
            console.log("New notification preferences:", preferences)
            setShowNotificationPreferences(false)
          }}
        />
      )}

      {showStatusCustomization && (
        <StatusCustomization
          status={user?.status || "online"}
          customStatus={user?.customStatus || ""}
          onStatusChange={(status) => console.log("Status changed:", status)}
          onCustomStatusChange={(customStatus) => console.log("Custom status changed:", customStatus)}
          onClose={() => setShowStatusCustomization(false)}
        />
      )}

      {showAccountDeletion && (
        <AccountDeletion
          onClose={() => setShowAccountDeletion(false)}
          onDelete={() => {
            console.log("Account deleted")
            onLogout()
            setShowAccountDeletion(false)
          }}
        />
      )}
    </div>
  )
}

// Badge component for verified status
function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "outline" ? "border" : "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}
