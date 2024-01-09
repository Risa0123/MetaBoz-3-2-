import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import styles from '../styles/home.module.css';

const NewScreen = () => {
  const [data, setData] = useState({
    score: null, // 初回はnullにしておく
    characterMessage: '今日も頑張りましょう！', // バックエンドからのデータ（仮）
  });

  const [heartRateData, setHeartRateData] = useState({
    'activities-heart-intraday': {
      dataset: [],
    },
  });

  useEffect(() => {
    // Flaskバックエンドからデータを取得する処理
    fetch('http://localhost:5000/api/heartbeat')
      .then(response => response.json())
      .then(data => {
        setHeartRateData(data);

        // 最新の心拍値を取得
        const latestHeartRate = data['activities-heart-intraday']['dataset'][0].value;

        // データを更新
        setData(prevData => ({
          ...prevData,
          score: latestHeartRate,
        }));
      })
      .catch(error => console.error('Error fetching heartbeat data:', error));
  }, []);

  return (
    <div className={styles.container}>
      <img src="/Research Youロゴ.png" alt="ロゴ" className={styles.logo} />
      <div className={styles.scoreContainer}>
        <p className={styles.scoreText}>今日の集中力スコア</p>
        <p className={styles.scoreNumber}>{data.score !== null ? data.score : '---'}</p>
      </div>
      <div className={styles.characterContainer}>
        <img src="/home yurupo.png" alt="yurupo" className={styles.character} />
        <div className={styles.balloon}>
          <p>{data.characterMessage}</p>
        </div>
      </div>
      <footer className={styles.footer}>
        <div>
          {/* ボタン1 */}
          <button className={styles.footerButton}>
            <img src="/history.png" alt="History Icon" className={`${styles.icon} ${styles.icon1}`} />
          </button>
        </div>
        {/* 中央の縦線 */}
        <div className={styles.verticalLine}></div>
        <div>
          {/* ボタン2 */}
          <button className={styles.footerButton}>
            <img src="/message.png" alt="Message Icon" className={`${styles.icon} ${styles.icon2}`} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NewScreen;

