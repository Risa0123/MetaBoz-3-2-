const crypto = require('crypto');
const express = require('express');
const fetch = require('node-fetch');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const schedule = require('node-schedule');

if (require.main === module) {
  main();
}

async function main() {
  try {
    const app = express();
    const verifier = base64UrlEncode(crypto.randomBytes(64));
    const challenge = base64UrlEncode(sha256Hash(Buffer.from(verifier)));

    app.get('/signin', (req, res) => {
      const search = '?' + new URLSearchParams({
        'client_id': process.env.FITBIT_CLIENT_ID,
        'response_type': 'code',
        'code_challenge': challenge,
        'code_challenge_method': 'S256',
        'scope': 'heartrate',
      });

      const url = 'https://www.fitbit.com/oauth2/authorize' + search;
      res.redirect(url);
    });

    app.get('/callback', async (req, res, next) => {
        try {
          const credentials = Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64');
          const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'client_id': process.env.FITBIT_CLIENT_ID,
              'code': req.query.code,
              'code_verifier': verifier,
              'grant_type': 'authorization_code',
            }).toString(),
          });
  
          const tokenBody = await tokenResponse.json();
  
          if (tokenBody.errors) {
            console.error(tokenBody.errors[0].message);
            res.status(500).end();
            return;
          }
  
          const dataUrl = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json';
          const dataResponse = await fetch(dataUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${tokenBody['access_token']}`,
            },
          });
  
          const dataBody = await dataResponse.json();
  
          if (dataBody.errors) {
            console.error(dataBody.errors[0].message);
            res.status(500).end();
            return;
          }
  
          await saveDataToCSV(dataBody['activities-heart-intraday'].dataset);
          res.type('text/plain').send(JSON.stringify(dataBody, null, 2));
        } catch (err) {
          next(err);
        }
      });

    app.listen(3000, () => console.log('Server is running on port 3000'));

    // 毎日午前0時に実行
    schedule.scheduleJob('0 0 * * *', async () => {
      try {
        const data = await fetchDataFromFitbit();
        const fileName = getFileNameWithDate();
        await saveDataToCSV(data, fileName);
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

    async function fetchDataFromFitbit(accessToken) {
        const url = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json'; // 心拍数データのエンドポイント

        try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();

        // 応答からエラーをチェック
        if (!response.ok) {
            throw new Error(data.errors ? data.errors[0].message : 'Fitbit APIからデータを取得できませんでした。');
        }

        return data; // 心拍数データを返す
        } catch (error) {
        console.error('Fitbit APIからデータを取得中にエラーが発生しました:', error);
        throw error; // エラーを呼び出し元に伝播させる
        }
    }       

// アクセストークンを取得した後、この関数を呼び出す
const accessToken = 'あなたのアクセストークン';
fetchDataFromFitbit(accessToken).then(data => {
  console.log('取得したFitbitデータ:', data);
}).catch(error => {
  console.error('データ取得エラー:', error);
});

function getFileNameWithDate() {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD形式
  return `heartRateData_${dateString}.csv`;
}

function saveDataToCSV(data, fileName) {
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      {id: 'time', title: 'TIME'},
      {id: 'value', title: 'HEART_RATE'}
    ],
    append: true
  });

  const records = data.map(item => ({
    time: item.time,
    value: item.value
  }));

  return csvWriter.writeRecords(records)
    .then(() => {
      console.log(`Data was written to ${fileName} successfully.`);
    });
}

function base64UrlEncode(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function sha256Hash(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest();
}
