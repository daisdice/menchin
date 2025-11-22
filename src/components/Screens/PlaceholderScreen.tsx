import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import styles from './PlaceholderScreen.module.css';

interface PlaceholderScreenProps {
    title: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.content}
            >
                <Card title={title} className={styles.card}>
                    <div className={styles.message}>
                        <p>COMING SOON</p>
                    </div>
                    <GameButton variant="secondary" onClick={() => navigate('/')}>
                        TITLE
                    </GameButton>
                </Card>
            </motion.div>
        </div>
    );
};
