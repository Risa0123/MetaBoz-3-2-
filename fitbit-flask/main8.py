from flask import Flask, redirect, request, url_for
from urllib.parse import urlencode
import os
import yaml
import base64
from flask import Flask, request, Response
import requests


# 設定ファイルの読み込み
with open('./secret.yaml') as f:
    secret = yaml.safe_load(f)

# FitbitのクライアントIDとシークレットを環境変数から取得
FITBIT_CLIENT_ID = secret['fitbit']['client_id']
FITBIT_CLIENT_SECRET = secret['fitbit']['client_secret']

app = Flask(__name__)

import os
import hashlib
import base64

def generate_code_verifier(length=128):
    """安全なランダムな文字列を生成する"""
    token = os.urandom(length)
    return base64.urlsafe_b64encode(token).decode('utf-8').rstrip('=')

def generate_code_challenge(code_verifier):
    """code_verifierからcode_challengeを計算する"""
    hashed = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(hashed).decode('utf-8').rstrip('=')

# code_verifierの生成
code_verifier = generate_code_verifier()

# code_challengeの生成
code_challenge = generate_code_challenge(code_verifier)

@app.route('/signin')
def signin():
    # code_verifierとcode_challengeを生成
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)

    # その他のパラメータとともに認証URLを生成
    search = urlencode({
        'client_id': '23RQGH',
        'response_type': 'code',
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256',
        'scope': 'heartrate',
    })

    url = 'https://www.fitbit.com/oauth2/authorize?' + search
    return redirect(url)

@app.route('/callback')
def callback():
    try:
        # Fitbitのクレデンシャルを取得
        user = FITBIT_CLIENT_ID
        passw = FITBIT_CLIENT_SECRET
        #user = ('FITBIT_CLIENT_ID')
        #passw = ('FITBIT_CLIENT_SECRET')
        #user = os.environ.get('FITBIT_CLIENT_ID')
        #passw = os.environ.get('FITBIT_CLIENT_SECRET')
        credentials = base64.b64encode(f"{user}:{passw}".encode()).decode()

        # アクセストークンを取得
        token_url = 'https://api.fitbit.com/oauth2/token'
        token_response = requests.post(
            token_url,
            headers={
                'Authorization': f'Basic {credentials}',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data={
                'client_id': user,
                'code': request.args.get('code'),
                'code_verifier': verifier,  # verifierはあなたのcode_verifier変数
                'grant_type': 'authorization_code',
            }
        )
        token_body = token_response.json()

        # エラーチェック
        if 'errors' in token_body:
            print(token_body['errors'][0]['message'])
            return Response(status=500)

        # Fitbitのデータを取得
        data_url = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json'
        data_response = requests.get(
            data_url,
            headers={
                'Authorization': f"Bearer {token_body['access_token']}",
            }
        )
        data_body = data_response.json()

        # データのエラーチェック
        if 'errors' in data_body:
            print(data_body['errors'][0]['message'])
            return Response(status=500)

        return Response(
            response=json.dumps(data_body, indent=2),
            mimetype='text/plain'
        )

    except Exception as e:
        print(e)
        return Response(status=500)


if __name__ == '__main__':
    app.run(debug=True)
