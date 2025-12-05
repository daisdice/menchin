import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TROPHIES } from '../../data/trophies';
import { TrophyIcon } from './TrophyIcon';
import styles from './TrophyToastContainer.module.css';

interface TrophyToastContainerProps {
    trophyIds: string[];
    onComplete?: () => void;
}

interface ActiveToast {
    id: string;
    trophyId: string;
}

export const TrophyToastContainer: React.FC<TrophyToastContainerProps> = ({
    trophyIds,
    onComplete
}) => {
    const [queue, setQueue] = useState<string[]>([]);
    const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);
    const MAX_VISIBLE = 1; // Maximum toasts visible at once
    const TOAST_DURATION = 3000; // 3 seconds

    // Initialize queue when trophyIds change
    useEffect(() => {
        if (trophyIds.length > 0) {
            setQueue(trophyIds);
        }
    }, [trophyIds]);

    // Move toasts from queue to active display
    useEffect(() => {
        if (queue.length > 0 && activeToasts.length < MAX_VISIBLE) {
            const nextTrophyId = queue[0];
            const toastId = `${nextTrophyId}-${Date.now()}`;

            setActiveToasts(prev => [...prev, { id: toastId, trophyId: nextTrophyId }]);
            setQueue(prev => prev.slice(1));

            // Auto-remove after duration
            setTimeout(() => {
                setActiveToasts(prev => prev.filter(t => t.id !== toastId));
            }, TOAST_DURATION);
        }
    }, [queue, activeToasts]);

    // Call onComplete when all toasts are done
    useEffect(() => {
        if (trophyIds.length > 0 && queue.length === 0 && activeToasts.length === 0) {
            onComplete?.();
        }
    }, [queue, activeToasts, trophyIds, onComplete]);

    return (
        <div className={styles.container}>
            <AnimatePresence mode="wait">
                {activeToasts.map((toast) => {
                    const trophy = TROPHIES.find(t => t.id === toast.trophyId);
                    if (!trophy) return null;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className={styles.toast}
                        >
                            <div className={styles.icon}>
                                <TrophyIcon tier={trophy.tier} size="small" />
                            </div>
                            <div className={styles.content}>
                                <div className={styles.label}>TROPHY ACHIEVED!</div>
                                <div className={styles.title}>{trophy.title}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
