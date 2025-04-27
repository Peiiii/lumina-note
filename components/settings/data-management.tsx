"use client"

import type React from "react"

import { useState } from "react"
import { Download, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/context/notes-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DataManagement() {
  const { exportData, importData } = useNotes()
  const { toast } = useToast()
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleExport = () => {
    const dataStr = exportData()
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `lumina-notes-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "导出成功",
      description: "您的笔记数据已成功导出",
    })
  }

  const handleImportClick = () => {
    setShowImportDialog(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    if (!importFile) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const result = e.target?.result
        if (typeof result === "string") {
          const success = importData(result)
          if (success) {
            toast({
              title: "导入成功",
              description: "您的笔记数据已成功导入",
            })
            setShowImportDialog(false)
          } else {
            toast({
              title: "导入失败",
              description: "无效的数据格式",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        toast({
          title: "导入失败",
          description: "处理文件时出错",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(importFile)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">数据管理</h3>
            <p className="text-sm text-gray-400">导出或导入您的笔记数据</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              导入数据
            </Button>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>提示</AlertTitle>
          <AlertDescription>定期导出您的数据以防止意外丢失。导入数据将覆盖当前的所有笔记和空间。</AlertDescription>
        </Alert>
      </div>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导入数据</DialogTitle>
            <DialogDescription>选择要导入的JSON文件。导入将覆盖当前的所有笔记和空间。</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700"
            />
          </div>

          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>警告</AlertTitle>
            <AlertDescription>导入操作将覆盖您当前的所有数据，此操作无法撤销。</AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              取消
            </Button>
            <Button onClick={handleImport} disabled={!importFile}>
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
