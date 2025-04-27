"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, ImageIcon, X } from "lucide-react"
import { isMobile } from "@/lib/utils/mobile-utils"

interface MobileImageUploadProps {
  onImageSelected: (imageUrl: string) => void
}

export function MobileImageUpload({ onImageSelected }: MobileImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirm = () => {
    if (previewUrl) {
      onImageSelected(previewUrl)
      setIsOpen(false)
      setPreviewUrl(null)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setPreviewUrl(null)
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-full"
        aria-label="Upload Image"
      >
        <ImageIcon className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>上传图片</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto rounded-md object-contain max-h-[300px]"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={openFileSelector}>
                  <ImageIcon className="h-6 w-6" />
                  <span>从相册选择</span>
                </Button>

                {isMobile() && (
                  <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={openCamera}>
                    <Camera className="h-6 w-6" />
                    <span>拍照</span>
                  </Button>
                )}
              </div>
            )}

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {isMobile() && (
              <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleConfirm} disabled={!previewUrl}>
                确认
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
