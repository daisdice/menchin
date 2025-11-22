import React from 'react';
import { motion } from 'framer-motion';
import styles from './InkTransition.module.css';

export const InkTransition: React.FC = () => {
    return (
        <motion.div
            className={styles.overlay}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 20, opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        />
    );
};
