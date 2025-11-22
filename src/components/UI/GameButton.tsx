import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './GameButton.module.css';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    fullWidth = false,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ y: 2 }}
            whileTap={{ y: 4 }}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                className
            )}
            {...props as any}
        >
            <span className={styles.content}>{children}</span>
        </motion.button>
    );
};
