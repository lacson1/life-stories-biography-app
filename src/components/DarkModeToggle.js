import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDark));
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return ( <
        button onClick = {
            () => setIsDark(!isDark)
        }
        className = "p-2 rounded-lg bg-amber-100 dark:bg-gray-700 hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors"
        title = { isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' } > {
            isDark ? ( <
                Sun className = "w-5 h-5 text-amber-600 dark:text-yellow-400" / >
            ) : ( <
                Moon className = "w-5 h-5 text-amber-600" / >
            )
        } <
        /button>
    );
};

export default DarkModeToggle;