from requests import Session
from pprint import pprint
import json
import csv
import sqlite3

session = Session()

with open("./test_conf.json", "r", encoding="utf-8") as f:
    conf = json.load(f)


def bearer_header():
    return {"Authorization": "Bearer " + conf["access_token"]}


def refresh():
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


# スクリプトの実行
res = heartbeat()
data = res.json()
pprint(data)

# 心拍数データをSQLiteに保存
save_to_sqlite(data)
