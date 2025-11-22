import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.backdrop}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className={styles.modalContainer}
                    >
                        <Card title={title} className={styles.modalCard}>
                            {children}
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
