import React from 'react';
import styles from './TrophyIcon.module.css';

interface TrophyIconProps {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const TrophyIcon: React.FC<TrophyIconProps> = ({ tier, size = 'medium', className }) => {
    return (
        <div className={`${styles.trophyIcon} ${styles[size]} ${className || ''}`}>
            <img
                src={`/menchin/trophies/trophy-${tier}.png`}
                alt={`${tier} trophy`}
                className={styles.trophyImage}
            />
        </div>
    );
};
