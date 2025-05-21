"use client"

import type React from "react"

import { useState } from "react"
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
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

type AccountDeletionProps = {
  onClose: () => void
  onDelete: () => void
}

export function AccountDeletion({ onClose, onDelete }: AccountDeletionProps) {
  const [confirmation, setConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const handleConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmation(e.target.value)
  }

  const handleProceed = () => {
    setStep(2)
  }

  const handleDelete = async () => {
    if (confirmation !== "DELETE") return

    setIsDeleting(true)

    try {
      // In a real app, you would delete the account via your backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onDelete()
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {step === 1 ? "Delete Account?" : "Confirm Account Deletion"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
              : "Please type DELETE to confirm that you want to permanently delete your account."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md space-y-2">
                <h4 className="font-medium text-destructive">What happens when you delete your account:</h4>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Your profile and account information will be permanently deleted</li>
                  <li>You will lose access to all your conversations and messages</li>
                  <li>Your data cannot be recovered once deleted</li>
                  <li>You'll need to create a new account if you want to use the service again</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">
                  This action is permanent and cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-destructive">
                  Type DELETE to confirm
                </Label>
                <Input
                  id="confirmation"
                  value={confirmation}
                  onChange={handleConfirmation}
                  className="border-destructive/50 focus-visible:ring-destructive"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button variant="destructive" onClick={handleProceed}>
              Proceed
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete} disabled={confirmation !== "DELETE" || isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
