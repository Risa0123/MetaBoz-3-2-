from flask import Flask, jsonify
from requests import Session
import requests  # requests ライブラリをインポート
import json
import csv
import base64
import sqlite3
from flask_cors import CORS

from db_control import crud, mymodels

# Flaskアプリケーションの初期化
app = Flask(__name__)
CORS(app)
# セッションの設定
session = Session()

# 設定ファイルの読み込み
with open("./test_conf2.json", "r", encoding="utf-8") as f:
    conf = json.load(f)

# Bearer認証用ヘッダを生成
'''
def today() -> str:
    """本日の日付を返す。

    Returns:
        str: YYYY-MM-DD
    """
    now = datetime.datetime.now()
    return f"{now.year}-{now.month}-{now.day}"
'''
def bearer_header():
    """Bearer認証用ヘッダ
    Returns:
        dict: {"Authorization":"Bearer " + your-access-token}
    """
    return {"Authorization": "Bearer " + conf["access_token"]}


def refresh():
    """
    access_tokenを再取得し、conf.jsonを更新する。
    refresh_tokenは再取得に必要なので重要。
    is_expiredがTrueの時のみ呼ぶ。
    False時に呼んでも一式更新されるので、実害はない。
    """

    url = "https://api.fitbit.com/oauth2/token"

    # client typeなのでclient_idが必要
    params = {
        "grant_type": "refresh_token",
        "refresh_token": conf["refresh_token"],
        "client_id": conf["client_id"],
    }

    # POST実行。 Body部はapplication/x-www-form-urlencoded。requestsならContent-Type不要。
    res = session.post(url, data=params)

    # responseをパース
    res_data = res.json()

    # errorあり
    if res_data.get("errors") is not None:
        emsg = res_data["errors"][0]
        print(emsg)
        return

    # errorなし。confを更新し、ファイルを更新
    conf["access_token"] = res_data["access_token"]
    conf["refresh_token"] = res_data["refresh_token"]
    with open("./test_conf2.json", "w", encoding="utf-8") as f:
        json.dump(conf, f, indent=2)



def is_expired(resObj) -> bool:
    """
    Responseから、accesss-tokenが失効しているかチェックする。
    失効ならTrue、失効していなければFalse。Fitbit APIでは8時間が寿命。
    Args:
        reqObj (_type_): response.json()したもの

    Returns:
        boolean: 失効ならTrue、失効していなければFalse
    """

    errors = resObj.get("errors")

    # エラーなし。
    if errors is None:
        return False

    # エラーあり
    for err in errors:
        etype = err.get("errorType")
        if (etype is None):
            continue
        if etype == "expired_token":
            print("TOKEN_EXPIRED!!!")
            return True

    # 失効していないのでFalse。エラーありだが、ここでは制御しない。
    return  False


def request(method, url, **kw):
    """
    sessionを通してリクエストを実行する関数。
    アクセストークンが8Hで失効するため、失効時は再取得し、
    リクエストを再実行する。
    レスポンスはパースしないので、呼ぶ側で.json()なり.text()なりすること。

    Args:
        method (function): session.get,session.post...等
        url (str): エンドポイント
        **kw: headers={},params={}を想定

    Returns:
        session.Response: レスポンス
    """

    # パラメタで受け取った関数を実行し、jsonでパース
    res = method(url, **kw)
    res_data = res.json()

    if is_expired(res_data):
        # 失効していしている場合、トークンを更新する
        refresh()
        # headersに設定されているトークンも
        # 新しい内容に更新して、methodを再実行
        kw["headers"] = bearer_header()
        res = method(url, **kw)
    # parseしていないほうを返す
    return res

'''
#date='2024-01-09'
##period='1w'
# Fitbit APIから心拍数データを取得
@app.route('/vital_data/<date>/<period>', methods=['GET'])
def heartbeat(date: str = "today", period: str = "1d"):
    url = f"https://api.fitbit.com/1/user/-/activities/heart/date/{date}/{period}.json"
    headers = bearer_header()
    response = request(session.get, url, headers=headers)
    #response = session.get(url, headers=headers)
      # 応答のJSONデータを取得
    heart_data = response.json()

    # データベースに書き込む
    write_to_database(date, heart_data)
    return jsonify(response.json())
'''
import requests  # requests ライブラリをインポート

@app.route('/vital_data/<date>/<period>', methods=['GET'])
def heartbeat(date: str = "today", period: str = "1d"):
    url = f"https://api.fitbit.com/1/user/-/activities/heart/date/{date}/{period}.json"
    headers = bearer_header()
    response = requests.get(url, headers=headers)  # requests.get を使用

    if response.status_code == 200:
        heart_data = response.json()
        write_to_database(date, heart_data)
        return jsonify(heart_data)
    else:
        return jsonify({'error': 'API request failed'}), response.status_code



# ホームルート
@app.route('/')
def home():
    return "Heartbeat API"

#データベース書き込み関数



def write_to_database(date, heart_data):
    conn = sqlite3.connect('fitbit_data.db')
    c = conn.cursor()

    # activities_heart テーブルに書き込む
    c.execute('INSERT INTO activities_heart (date, restingHeartRate) VALUES (?, ?)', 
              (date, heart_data.get('value', {}).get('restingHeartRate')))
    activity_heart_id = c.lastrowid

    # heart_rate_zones テーブルに書き込む
    for zone in heart_data.get('value', {}).get('heartRateZones', []):
        c.execute('INSERT INTO heart_rate_zones (activity_heart_id, name, min, max, minutes, caloriesOut) VALUES (?, ?, ?, ?, ?, ?)', 
                  (activity_heart_id, zone['name'], zone['min'], zone['max'], zone['minutes'], zone['caloriesOut']))

    conn.commit()
    conn.close()


# Flaskアプリケーションの実行
if __name__ == '__main__':
    app.run(debug=True)
