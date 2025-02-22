'use client'
import React from 'react'
import { useTheme } from "next-themes"
import { Button } from './button'
import { Moon, Sun } from 'lucide-react'

export default function ThemeButton() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
        >
            {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
    )
}
