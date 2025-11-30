import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>OPTIONS</h1>
                </div>

                <div className={styles.optionsContainer}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>データ管理</h3>

                        {!showConfirm ? (
                            <GameButton
                                variant="danger"
                                onClick={() => setShowConfirm(true)}
                                fullWidth
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
                    </div>
                </div>

                <div className={styles.actions}>
                    <GameButton variant="secondary" onClick={() => navigate('/')} fullWidth>
                        BACK
                    </GameButton>
                </div>
            </div>
        </div>
    );
};
