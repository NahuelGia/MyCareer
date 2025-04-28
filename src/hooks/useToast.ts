import { toaster } from "@components/ui/toaster"

type ToastType = "info" | "success" | "warning" | "error" | "loading"

export function useToast() {
  const showToast = (options: {
    title?: string
    description: string
    type?: ToastType
    duration?: number
  }) => {
    toaster.create({
      title: options.title,
      description: options.description,
      type: options.type || "info",
      duration: options.duration || 3000,
      meta: {
        closable: true,
      },
    })
  }

  return { showToast }
} 