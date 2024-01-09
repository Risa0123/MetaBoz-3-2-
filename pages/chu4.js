// pages/tutorial.js

import React from 'react';
import styles from '../styles/chu4.module.css';

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
        あなたのことを知れば知るほど<br/>
        ゆるぽはどんどんあなたの<br/>
        かけがえのない存在となり、<br/>
        あなたが困らなくなるように<br/>
        サポートしてくれます。<br/>
        </p>

        <div>
          <img src="/chu4.png" alt="ロゴ" className={styles.logo2} />
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