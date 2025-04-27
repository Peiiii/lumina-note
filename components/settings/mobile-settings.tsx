"use client"

import type React from "react"

import { useState } from "react"
import { Settings, Moon, Sun, Download, LogOut, User, Bell, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DataManagement } from "@/components/settings/data-management"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface MobileSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSettings({ open, onOpenChange }: MobileSettingsProps) {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const renderSection = () => {
    switch (activeSection) {
      case "theme":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">主题设置</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-6 w-6" />
                <span>浅色</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-6 w-6" />
                <span>深色</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setTheme("system")}
              >
                <Settings className="h-6 w-6" />
                <span>系统</span>
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveSection(null)}>
              返回
            </Button>
          </div>
        )
      case "data":
        return (
          <div>
            <DataManagement />
            <Button variant="outline" className="w-full mt-4" onClick={() => setActiveSection(null)}>
              返回
            </Button>
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">通知设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-updates">应用更新</Label>
                  <p className="text-sm text-gray-400">接收新功能和更新通知</p>
                </div>
                <Switch id="notify-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-reminders">提醒</Label>
                  <p className="text-sm text-gray-400">接收笔记提醒通知</p>
                </div>
                <Switch id="notify-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-ai">AI 建议</Label>
                  <p className="text-sm text-gray-400">接收AI生成的内容建议</p>
                </div>
                <Switch id="notify-ai" />
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveSection(null)}>
              返回
            </Button>
          </div>
        )
      case "account":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">账户设置</h3>
            <div className="p-4 bg-gray-800 rounded-lg text-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <h4 className="font-medium">用户名</h4>
              <p className="text-sm text-gray-400">user@example.com</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveSection(null)}>
              返回
            </Button>
          </div>
        )
      case "privacy":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">隐私设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacy-analytics">分析数据</Label>
                  <p className="text-sm text-gray-400">允许收集匿名使用数据</p>
                </div>
                <Switch id="privacy-analytics" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacy-ai">AI 训练</Label>
                  <p className="text-sm text-gray-400">允许使用笔记内容改进AI</p>
                </div>
                <Switch id="privacy-ai" />
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setActiveSection(null)}>
              返回
            </Button>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            <SettingsButton
              icon={<Moon className="h-6 w-6" />}
              label="主题"
              onClick={() => setActiveSection("theme")}
            />
            <SettingsButton
              icon={<Download className="h-6 w-6" />}
              label="数据"
              onClick={() => setActiveSection("data")}
            />
            <SettingsButton
              icon={<Bell className="h-6 w-6" />}
              label="通知"
              onClick={() => setActiveSection("notifications")}
            />
            <SettingsButton
              icon={<User className="h-6 w-6" />}
              label="账户"
              onClick={() => setActiveSection("account")}
            />
            <SettingsButton
              icon={<Lock className="h-6 w-6" />}
              label="隐私"
              onClick={() => setActiveSection("privacy")}
            />
            <SettingsButton icon={<LogOut className="h-6 w-6" />} label="退出" onClick={() => {}} />
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white p-6 max-w-full h-[90vh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{activeSection ? "" : "设置"}</DialogTitle>
        </DialogHeader>
        {renderSection()}
      </DialogContent>
    </Dialog>
  )
}

interface SettingsButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function SettingsButton({ icon, label, onClick }: SettingsButtonProps) {
  return (
    <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </Button>
  )
}
