import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Apply theme on app initialization and theme changes
 */
export const useThemeEffect = () => {
    const theme = useAppStore((state) => state.settings.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);

        // Update theme-color meta tag for PWA
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const color = theme === 'dark' ? '#1A1A1A' : '#F7F7F0';
            metaThemeColor.setAttribute('content', color);
        }
    }, [theme]);
};
