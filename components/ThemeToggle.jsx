"use client"
import React,{ useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeToggle = ({ className, iconSize = 20 }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

  return (
    <Button
        variant='outline'
        size='icon'
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={cn("relative rounded-full p-1 w-10 h-10 flex items-center justify-center", className)}
    >
        <Sun
            className={cn(
                "absolute transition-all duration-500 transform ease-[cubic-bezier(0.4,0,0.2,1)] size-5",
                theme === "dark"
                    ? "opacity-0 scale-75 -rotate-45"
                    : "opacity-100 scale-105 rotate-0"
            )}
        />
        <Moon
            className={cn(
                "absolute transition-all duration-500 transform ease-[cubic-bezier(0.4,0,0.2,1)] size-5",
                theme === "dark"
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-75 rotate-45"
            )}
        />
    </Button>
  )
}

export default ThemeToggle