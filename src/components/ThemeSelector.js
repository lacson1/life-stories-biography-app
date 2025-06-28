import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const themes = [{
            id: 'amber',
            name: 'Warm Amber',
            description: 'Classic warm and inviting',
            colors: {
                primary: 'amber',
                gradient: 'from-amber-50 to-orange-100',
                accent: 'amber-600',
                border: 'amber-200'
            }
        },
        {
            id: 'blue',
            name: 'Ocean Blue',
            description: 'Calm and serene',
            colors: {
                primary: 'blue',
                gradient: 'from-blue-50 to-cyan-100',
                accent: 'blue-600',
                border: 'blue-200'
            }
        },
        {
            id: 'green',
            name: 'Forest Green',
            description: 'Natural and peaceful',
            colors: {
                primary: 'green',
                gradient: 'from-green-50 to-emerald-100',
                accent: 'green-600',
                border: 'green-200'
            }
        },
        {
            id: 'purple',
            name: 'Royal Purple',
            description: 'Elegant and sophisticated',
            colors: {
                primary: 'purple',
                gradient: 'from-purple-50 to-violet-100',
                accent: 'purple-600',
                border: 'purple-200'
            }
        },
        {
            id: 'rose',
            name: 'Vintage Rose',
            description: 'Soft and nostalgic',
            colors: {
                primary: 'rose',
                gradient: 'from-rose-50 to-pink-100',
                accent: 'rose-600',
                border: 'rose-200'
            }
        }
    ];

    useEffect(() => {
        // Apply theme to document root
        const root = document.documentElement;
        const theme = themes.find(t => t.id === currentTheme) || themes[0];

        root.style.setProperty('--theme-primary', theme.colors.primary);
        root.style.setProperty('--theme-accent', theme.colors.accent);
        root.style.setProperty('--theme-border', theme.colors.border);
        root.style.setProperty('--theme-gradient', theme.colors.gradient);
    }, [currentTheme, themes]);

    const selectTheme = (themeId) => {
        onThemeChange(themeId);
        setIsOpen(false);
    };

    const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

    return ( <
        div className = "relative" >
        <
        button onClick = {
            () => setIsOpen(!isOpen)
        }
        className = "flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" >
        <
        Palette className = "h-4 w-4" / >
        <
        span > { currentThemeData.name } < /span> < /
        button >

        {
            isOpen && ( <
                div className = "absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50" >
                <
                div className = "p-3 border-b border-gray-200" >
                <
                h3 className = "font-semibold text-gray-800" > Choose Theme < /h3> <
                p className = "text-xs text-gray-600" > Customize your biography 's appearance</p> < /
                div >

                <
                div className = "p-2 space-y-1" > {
                    themes.map(theme => ( <
                            button key = { theme.id }
                            onClick = {
                                () => selectTheme(theme.id)
                            }
                            className = { `w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  currentTheme === theme.id ? 'bg-gray-50 ring-2 ring-blue-500' : ''
                }` } >
                            <
                            div className = "flex items-center space-x-3" >
                            <
                            div className = { `w-6 h-6 rounded-full bg-${theme.colors.primary}-500` } > < /div> <
                            div >
                            <
                            div className = "font-medium text-sm text-gray-800" > { theme.name } < /div> <
                            div className = "text-xs text-gray-600" > { theme.description } < /div> < /
                            div > <
                            /div> {
                            currentTheme === theme.id && ( <
                                Check className = "h-4 w-4 text-blue-600" / >
                            )
                        } <
                        /button>
                    ))
            } <
            /div>

            <
            div className = "p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg" >
            <
            p className = "text-xs text-gray-600" > 💡Themes affect colors throughout your biography,
            including exports <
            /p> < /
            div > <
            /div>
        )
    }

    { /* Overlay to close dropdown */ } {
        isOpen && ( <
            div className = "fixed inset-0 z-40"
            onClick = {
                () => setIsOpen(false)
            }
            />
        )
    } <
    /div>
);
};

export default ThemeSelector;