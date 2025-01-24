import React, { useId } from "react"
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
import { deleteModel } from "@/actions/model"

type Props = {
  children: React.ReactElement
  id: number
  modelId: string
  modelVersion: string
  loading: boolean
  setLoading: (load: boolean) => void
}

const DeleteModelDialog = ({
  children,
  id,
  modelId,
  modelVersion,
  loading,
  setLoading,
}: Props) => {
  const toastId = useId()
  const handleDeleteModel = async () => {
    setLoading(true)
    toast.loading("Deleting model...", { id: toastId })
    const { error, success } = await deleteModel(id, modelId, modelVersion)
    if (error) {
      toast.error("Error deleting model", { id: toastId })
      setLoading(false)
      return
    }
    if (success) {
      toast.success("Successfully deleted the model", { id: toastId })
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and
            remove your trained model from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={() => handleDeleteModel()}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModelDialog
