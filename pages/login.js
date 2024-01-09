// pages/login.js

import React, { useState, useEffect } from 'react';
import styles from '../styles/login.module.css';

const LoginPage = () => {
  const [inputs, setInputs] = useState({
    // フォームの入力値を管理する state
    // ... (既存の state も含めて必要に応じて追加)
  });

  const handleInputChange = (e) => {
    // 入力フォームの変更を処理する関数
    // ... (必要に応じて追加)
  };

  const isFormValid = true; // フォームが有効かどうかの判定ロジックを追加

  useEffect(() => {
    console.log('Form inputs:', inputs);
  }, [inputs]);

  return (
    <div className={styles.container}>
    <header className={styles.header}>
    <div>
      <img src="/Research Youロゴ.png" alt="ロゴ" className={styles.logo} />
    </div>
    <nav className={styles.nav}>
    {/* ログインタイトル */}
    <p className={`${styles.bold} ${styles.loginTitle}`}>ログイン</p>
      <div className={styles.cell}>
        <input type="text" placeholder="メールアドレス" className={styles.input} onChange={handleInputChange} />
      </div>
      <div className={styles.cell}>
        <input type="password" placeholder="パスワード" className={styles.input} onChange={handleInputChange} />
      </div>

      <button className={`${styles.button} ${styles.buttonContainer} ${styles.loginButton}`} disabled={!isFormValid}>ログイン</button>

      {/* 横棒 */}
      <div className={styles.horizontalLine}></div>

      {/* アカウント新規作成ボタン */}
      <button className={`${styles.button} ${styles.buttonContainer} ${styles.createAccountButton}`} disabled={!isFormValid}>
          アカウントを新規作成
      </button>
       </nav>
      </header>
    </div>
  );
};

export default LoginPage;
