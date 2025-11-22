import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
    return (
        <div className={clsx(styles.card, className)}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
