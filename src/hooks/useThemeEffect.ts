import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Apply theme on app initialization and theme changes
 */
export const useThemeEffect = () => {
    const theme = useAppStore((state) => state.settings.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
};
