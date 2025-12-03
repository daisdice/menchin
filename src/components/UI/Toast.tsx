import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    isVisible: boolean;
    icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, icon }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <div className={styles.container}>
                    <motion.div
                        className={styles.toast}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        {icon && <span className={styles.icon}>{icon}</span>}
                        <span>{message}</span>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
