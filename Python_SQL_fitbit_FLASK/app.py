from flask import Flask, render_template
import sqlite3

app = Flask(__name__)

def fetch_data_from_sqlite(db_filename="fitbitData.db"):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    # SQLiteデータベースからデータを取得
    cursor.execute('SELECT * FROM heartRateData')
    data = cursor.fetchall()

    conn.close()

    return data

@app.route('/display_data', methods=['GET'])
def display_data():
    # SQLiteデータベースからデータを取得
    data = fetch_data_from_sqlite()

    # データがない場合はエラーを返すか、適切にハンドリング
    if not data:
        return render_template('no_data.html')

    return render_template('display_data.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)


from flask import Flask, jsonify

app = Flask(__name__)

# OAuth2の認証情報を格納するための変数
conf = {}

@app.route('/update_heartbeat', methods=['GET'])
def update_heartbeat():
    global conf  # グローバル変数を関数内で使用するために必要

    # 心拍データを取得
    res = heartbeat()

    # 取得したデータをSQLiteに保存
    data = res.json()
    save_to_sqlite(data)

    return jsonify({"message": "Heartbeatデータが正常に更新されました"})

def bearer_header():
    return {"Authorization": "Bearer " + conf["access_token"]}

def refresh():
    global conf

    url = "https://api.fitbit.com/oauth2/token"
    params = {
        "grant_type": "refresh_token",
        "refresh_token": conf["refresh_token"],
        "client_id": conf["client_id"],
    }
    res = session.post(url, data=params)
    res_data = res.json()

    if res_data.get("errors") is not None:
        emsg = res_data["errors"][0]
        print(emsg)
        return

    conf["access_token"] = res_data["access_token"]
    conf["refresh_token"] = res_data["refresh_token"]

    # 更新された認証情報をファイルに保存（必要に応じてセキュアな保存方法を検討）
    with open("./test_conf.json", "w", encoding="utf-8") as f:
        json.dump(conf, f, indent=2)

def is_expired(resObj) -> bool:
    errors = resObj.get("errors")

    if errors is None:
        return False

    for err in errors:
        etype = err.get("errorType")
        if etype is None:
            continue
        if etype == "expired_token":
            pprint("TOKEN_EXPIRED!!!")
            return True

    return False

def request(method, url, **kw):
    res = method(url, **kw)
    res_data = res.json()

    if is_expired(res_data):
        refresh()
        kw["headers"] = bearer_header()
        res = method(url, **kw)

    return res

def heartbeat(date: str = "today", period: str = "1d"):
    url = f"https://api.fitbit.com/1/user/-/activities/heart/date/{date}/{period}.json"
    headers = bearer_header()
    res = request(session.get, url, headers=headers)

    return res

def save_to_sqlite(data, db_filename="fitbitData.db"):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS heartRateData (
            time TEXT,
            value INTEGER
        )
    ''')

    for record in data['activities-heart-intraday']['dataset']:
        time = record['time']
        value = record['value']
        cursor.execute('''
            INSERT INTO heartRateData (time, value)
            VALUES (?, ?)
        ''', (time, value))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    # Flaskアプリをデバッグモードで実行
    app.run(debug=True)
