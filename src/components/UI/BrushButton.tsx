import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './BrushButton.module.css';

interface BrushButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const BrushButton: React.FC<BrushButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    onDrag, // Extract onDrag to prevent passing it to motion.button if it causes issues
    ...props
}) => {
    // We need to cast props to any or specific motion props because standard button props 
    // might conflict with motion props if not careful, but usually it's fine.
    // The issue was specifically onDrag type mismatch.

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(styles.button, styles[variant], styles[size], className)}
            {...props as any}
        >
            <span className={styles.brushStroke}></span>
            <span className={styles.content}>{children}</span>
        </motion.button>
    );
};
