import React, { useState, useEffect } from 'react';
import styles from '../styles/setting.module.css';

const Setting = () => {
  const [inputs, setInputs] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (name, value) => {
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    const allInputsFilled = Object.values(inputs).every((input) => input !== '');
    setIsFormValid(allInputsFilled);
  };

  useEffect(() => {
    console.log('Form inputs:', inputs);
  }, [inputs]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <img src="/Research Youロゴ.png" alt="ロゴ" className={styles.logo} />
        </div>

        <p className={`${styles.text}`}>
          1か月間、22時に集中力が上がるよ<br />
          うにゆるぽがアドバイスをします！<br />
        </p>

        {/* 目標入力欄*/}
        <div className={styles.cell}>
        <p className={`${styles.title} `}>あなたの目標を教えてください。</p>
        <div className={styles.inputContainer}>
        <textarea rows="4" className={styles.input} onChange={(e) => handleInputChange('goal', e.target.value)}></textarea>
        <label className={styles.inputLabel}>30文字以内でやりたいことを記載しましょう！</label>
        </div>
        </div>
        <button className={`${styles.nextbutton} `} disabled={!isFormValid}>
          次へ
        </button>
      </header>
    </div>
  );
};

export default Setting;
