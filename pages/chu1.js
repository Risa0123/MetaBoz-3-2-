// pages/tutorial.js

import React from 'react';
import styles from '../styles/chu1.module.css';

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
          Research Youは<br/>
          優秀なAIくまの「ゆるぽ」が<br/>
          バイタルや行動の情報から<br/>
          あなたの<b>「集中力スイッチ」</b>を<br/>
          見つけます。
        </p>

        <div>
          <img src="/chu1.png" alt="ロゴ" className={styles.logo2} />
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
