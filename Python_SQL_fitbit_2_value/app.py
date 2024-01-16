from flask import Flask, render_template
import sqlite3

app = Flask(__name__)

# SQLiteから最新のデータを取得する関数
def fetch_latest_data(db_filename="fitbitData.db"):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    # heartRateDataテーブルから最新の1件を取得
    cursor.execute('''
        SELECT * FROM heartRateData
        ORDER BY time DESC
        LIMIT 1
    ''')
    data = cursor.fetchone()

    conn.close()

    return data

# データを表示するためのルート
@app.route('/display_latest_value', methods=['GET'])
def display_latest_value():
    # SQLiteデータベースから最新のデータを取得
    data = fetch_latest_data()

    # データがない場合はエラーを返すか、適切にハンドリング
    if not data:
        return render_template('no_data.html')

    # 最新のデータのvalueを取得
    latest_value = data[1]

    # ブラウザに表示
    return f"Latest Value: {latest_value}"

if __name__ == '__main__':
    # Flaskアプリをデバッグモードで実行
    app.run(debug=True)
