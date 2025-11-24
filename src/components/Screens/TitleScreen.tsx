import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import styles from './TitleScreen.module.css';

export const TitleScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={styles.titleContainer}
            >
                <h1 className={styles.title}>CHIN'IT</h1>
                <span className={styles.alphaBadge}>ALPHA</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.menuContainer}
            >
                <GameButton
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/mode')}
                    fullWidth
                    className={styles.startButton}
                >
                    START
                </GameButton>

                <div className={styles.menuSection}>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/ranking')}>
                        RANKING
                    </GameButton>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/stats')}>
                        RECORD
                    </GameButton>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/trophies')}>
                        COLLECTION
                    </GameButton>
                </div>

                <GameButton
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/options')}
                    fullWidth
                    className={styles.optionsButton}
                >
                    OPTIONS
                </GameButton>
            </motion.div>
        </div>
    );
};
