import React from 'react';
import { useLocation } from 'react-router-dom';
import { InkTransition } from '../UI/InkTransition';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {children}
            </main>
            <div className={styles.vignette}></div>
            {/* Trigger transition on route change */}
            <InkTransition key={location.pathname} />
        </div>
    );
};
