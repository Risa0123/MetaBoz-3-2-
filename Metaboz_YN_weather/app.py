import requests
import sqlite3
import schedule
import time

# SQLiteデータベースのファイルパス
DATABASE_FILE = 'weather_data.db'

# 天気情報APIのURL（東京の例）
API_URL = 'https://weather.tsukumijima.net/api/forecast/city/130010'

def create_table():
    # SQLiteデータベース内にテーブルを作成する関数
    with sqlite3.connect(DATABASE_FILE) as connection:
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weather_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data TEXT
            )
        ''')

def insert_weather_data(data):
    # SQLiteデータベースに天気情報を挿入する関数
    with sqlite3.connect(DATABASE_FILE) as connection:
        cursor = connection.cursor()
        cursor.execute('INSERT INTO weather_data (data) VALUES (?)', (data,))
        connection.commit()

def get_weather_data():
    # 天気情報APIからデータを取得する関数
    try:
        response = requests.get(API_URL)
        response.raise_for_status()  # エラーレスポンスがあれば例外を発生させる
        weather_data = response.json()
        return weather_data
    except requests.exceptions.RequestException as e:
        print(f"エラー: {e}")
        return None

def job():
    # 定期実行するジョブ
    weather_data = get_weather_data()
    
    if weather_data is not None:
        insert_weather_data(str(weather_data))
        print(f'We got weather data: {weather_data}')

# データベースのテーブル作成
create_table()

# 初回実行
job()

# 定期実行のスケジューリング（1分ごと）
schedule.every(1).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
    