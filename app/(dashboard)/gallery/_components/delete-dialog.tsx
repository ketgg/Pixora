import React, { useId, useState } from "react"
import { RiDeleteBin6Line } from "@remixicon/react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { deleteImage } from "@/actions/storage"

type Props = {
  imageId: string
  onDelete?: () => void
  imageName: string
  isPending: boolean
  setIsPending: (pending: boolean) => void
}

const DeleteDialog = ({
  imageId,
  onDelete,
  imageName,
  isPending,
  setIsPending,
}: Props) => {
  const toastId = useId()
  const handleDelete = async () => {
    setIsPending(true)
    toast.loading("Deleting image...", { id: toastId })
    const { error, success } = await deleteImage(imageId, imageName)
    if (error) {
      toast.error("Something went wrong. Please try again later.", {
        id: toastId,
      })
    } else if (success) {
      toast.success("Image deleted successfully.", { id: toastId })
      onDelete?.()
    } else {
      toast.dismiss(toastId)
    }
    setIsPending(false)
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isPending}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <RiDeleteBin6Line />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and
            remove your image from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog
