import React from 'react';
import styles from '../styles/splash.module.css'

const SplashPage = () => {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src="/centerロゴ.png" alt="Logo" />
    </div>
  );
};

export default SplashPage;