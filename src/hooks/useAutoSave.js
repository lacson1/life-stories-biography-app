import { useEffect, useRef } from 'react';

export const useAutoSave = (data, key, delay = 2000) => {
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                console.log('Data auto-saved to localStorage');
            } catch (error) {
                console.error('Failed to save data:', error);
            }
        }, delay);

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, key, delay]);

    // Load data from localStorage
    const loadData = () => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Failed to load data:', error);
            return null;
        }
    };

    // Clear saved data
    const clearData = () => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to clear data:', error);
        }
    };

    return { loadData, clearData };
};