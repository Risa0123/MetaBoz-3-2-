// pages/tutorial.js

import React from 'react';
import styles from '../styles/chu2.module.css';

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
        ゆるぽはあなたが<br/>
        頑張るための行動をしたのに<br/>
        思うように成果がでない<br/>
        原因も一緒に探します。<br/>
        </p>

        <div>
          <img src="/chu2.png" alt="ロゴ" className={styles.logo2} />
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