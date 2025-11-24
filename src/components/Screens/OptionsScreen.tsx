import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { useAppStore } from '../../store/useAppStore';
import styles from './OptionsScreen.module.css';

export const OptionsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleResetData = () => {
        // Clear localStorage
        localStorage.clear();

        // Reset app store
        useAppStore.persist.clearStorage();

        // Reload the page to reinitialize state
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.header}
            >
                <h2 className={styles.title}>OPTIONS</h2>
            </motion.div>

            <div className={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={styles.section}
                >
                    <h3 className={styles.sectionTitle}>データ管理</h3>

                    {!showConfirm ? (
                        <GameButton
                            variant="danger"
                            onClick={() => setShowConfirm(true)}
                        >
                            データを初期化
                        </GameButton>
                    ) : (
                        <div className={styles.confirmBox}>
                            <p className={styles.confirmMessage}>
                                すべてのデータ（ハイスコア、アンロック状況）が削除されます。<br />
                                本当によろしいですか？
                            </p>
                            <div className={styles.confirmButtons}>
                                <GameButton
                                    variant="danger"
                                    onClick={handleResetData}
                                >
                                    削除する
                                </GameButton>
                                <GameButton
                                    variant="secondary"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    キャンセル
                                </GameButton>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={styles.footer}
            >
                <GameButton variant="secondary" onClick={() => navigate('/')}>
                    BACK
                </GameButton>
            </motion.div>
        </div>
    );
};
