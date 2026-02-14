import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
    theme: string
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)    // store that provides

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));     // use saved theme if exist else use system preference

    // update the the theme when the state changes

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])


    const toggleTheme = () => {
        setTheme((prevTheme) => (
            prevTheme === 'light' ? 'dark' : 'light'
        ))
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("UseTheme must be used within a theme provider")
    }
    return context
}