// components/Header.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    nickname: '',
    birthdate: '',
    gender: '',
    height: '',
  });

  const handleInputChange = (name, value) => {
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));

    // 全ての項目が入力されたかどうかを判定
    const allInputsFilled = Object.values(inputs).every((input) => input !== '');

    // ボタンのアクティブ状態を更新
    setIsFormValid(allInputsFilled);
  };

  useEffect(() => {
    console.log('Form inputs:', inputs);
  }, [inputs]);

  return (
    <header className={styles.header}>
      <div>
        <img src="/Research Youロゴ.png" alt="ロゴ" className={styles.logo} />
      </div>
      <nav className={styles.nav}>
        <div className={`${styles.cell}`}>
          {/* 会員登録のタイトル */}
          <p className={`${styles.title} ${styles.registerTitle} ${styles.center}`}>会員登録</p>
        </div>

 {/* メールアドレスから身長までの各タイトル */}
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>メールアドレス</p>
          <input type="text" placeholder="メールアドレス" className={styles.input} onChange={handleInputChange} />
        </div>
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>パスワード</p>
          <input type="password" placeholder="8文字以内" className={styles.input} onChange={handleInputChange} />
        </div>
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>ニックネーム</p>
          <input type="text" placeholder="8文字以内" className={styles.input} onChange={handleInputChange} />
        </div>
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>生年月日</p>
          <input type="text" placeholder="例:20001001" className={styles.input} onChange={handleInputChange} />
        </div>
        {/* 性別 */}
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>性別</p>
          <div className={styles.genderOptions}>
            <input type="radio" name="gender" value="male" onChange={handleInputChange} />
            <label>男性</label>
            <input type="radio" name="gender" value="female" onChange={handleInputChange} />
            <label>女性</label>
            <input type="radio" name="gender" value="other" onChange={handleInputChange} />
            <label>その他</label>
          </div>
        </div>
        <div className={styles.cell}>
          <p className={`${styles.title} ${styles.bold} ${styles.left}`}>身長</p>
          <div className={styles.heightContainer}>
            <input type="text" placeholder="例：161" className={styles.input} onChange={handleInputChange} />
            <span>cm</span>
          </div>
        </div>
      </nav>
      <button className={`${styles.button} ${styles.buttonContainer}`} disabled={!isFormValid}>
        次へ
      </button>
    </header>

);
};

export default Header;


