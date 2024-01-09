import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import styles from '../styles/rireki.module.css';

const IndexPage = () => {
  const [vitalData, setVitalData] = useState({});
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  useEffect(() => {
    // Flaskアプリからデータを取得
    fetch('http://localhost:5000/api/heartbeat') 
      .then(response => response.json())
      .then(data => {
        setVitalData(data);

        // 折れ線グラフのデータセット
        const lineData = {
          labels: data['activities-heart-intraday']['dataset'].map(record => record.time),
          datasets: [
            {
              label: 'Heart Rate',
              data: data['activities-heart-intraday']['dataset'].map(record => record.value),
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        };
        setLineChartData(lineData);

        // 必要に応じて満足度のデータを取得し、棒グラフのデータセットを設定
        const satisfactionData = []; // 実際のデータ取得方法に合わせて修正
        const barData = {
          labels: data['activities-heart-intraday']['dataset'].map(record => record.time),
          datasets: [
            {
              label: 'Satisfaction',
              data: satisfactionData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
        setBarChartData(barData);
      })
      .catch(error => console.error('Error fetching vital data:', error));
  }, []);

  const goBack = () => {
    // 戻る処理
  };

  return (
    <div>
            <span onClick={goBack}>
        <img
          src="/戻るボタン.png"
          alt="戻る"
          style={{ width: '38px', height: '32px', cursor: 'pointer' }}
        />
      </span>
      <img
        src="/Research Youロゴ.png"
        alt="ロゴ"
        style={{ width: '201px', height: '35px' }}
      />

      <header>
        <h1>私の履歴</h1>
        {lineChartData && (
          <div style={{ marginBottom: '20px' }}>
            <h2>Heart Rate</h2>
            <Line data={lineChartData} />
          </div>
        )}
        {barChartData && (
          <div>
            <h2>Satisfaction</h2>
            <Bar data={barChartData} />
          </div>
        )}
      </header>
      {/* 他のコンポーネントやコンテンツ */}
    </div>
  );
};

export default IndexPage;


