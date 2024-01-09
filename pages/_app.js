// pages/_app.js

import '../styles/splash.module.css'; // グローバルCSSファイルをインポート

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
