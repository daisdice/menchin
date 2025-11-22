import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Tile as TileType } from '../../utils/mahjong';
import styles from './Tile.module.css';

interface TileProps {
    tile: TileType;
    onClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, selected, disabled }) => {
    // Manzu characters 1-9
    const manzuChars = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const char = manzuChars[tile - 1];

    return (
        <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={!disabled ? { y: -4 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            className={clsx(styles.tile, selected && styles.selected, disabled && styles.disabled)}
            onClick={!disabled ? onClick : undefined}
        >
            <div className={styles.face}>
                <span className={styles.number}>{char}</span>
                <span className={styles.suit}>萬</span>
            </div>
        </motion.div>
    );
};
