"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <MoonIcon className="h-[1.2rem] w-[1.2rem] transition-transform transform rotate-90 scale-100" />
      ) : (
        <SunIcon className="h-[1.2rem] w-[1.2rem] transition-transform transform rotate-0 scale-100" />
      )}
    </Button>
  )
}
