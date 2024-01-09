// pages/tutorial.js

import React from 'react';
import styles from '../styles/chu3.module.css';

const TutorialPage = () => {
  // 次へボタンの有効無効を示すisFormValidの初期値
  const isFormValid = true;

  return (
    <div className={styles.container}>
    <div>
      <img src="/Research Youロゴ.png" alt="ロゴ" className={styles.logo} />
      <nav className={styles.nav}>
        {/* テキスト */}
        <p className={`${styles.text}`}>
        まずはウェアラブルデバイスを<br/>
        連携して、あなたのことや目標を<br/>
        ゆるぽに教えてあげましょう！<br/>
        </p>

        <div>
          <img src="/chu3.png" alt="ロゴ" className={styles.logo2} />
        </div>

        <button
          className={`${styles.nextButton}`}
          disabled={!isFormValid}
        >
          次へ
        </button>
      </nav>
    </div>
    </div>
  );
};

export default TutorialPage;