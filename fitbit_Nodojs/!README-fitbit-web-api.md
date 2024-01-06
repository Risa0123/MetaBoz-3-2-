❤️ Fitbit Web APIを利用して心拍数の生データを取得する方法

- [この記事のGistページ](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/)
- [動画版](https://www.youtube.com/watch?v=_oZJTu4E-bM)

# この記事について

この記事ではNode.jsで [Fitbit Web API](https://dev.fitbit.com/build/reference/web-api/) を利用して心拍数の生データを取得する方法について紹介します。



# おおまかな手順

おおまかな手順を下記に示します。

1. Fitbitのアプリ登録
2. Webアプリのコーディング
3. 動作確認



# Fitbitのアプリ登録

Fitbit Web APIを利用するにはアプリをFitbitに登録する必要があります。[Fitbit SDK](https://dev.fitbit.com/) のページにアクセスして右上にある Manage > Register An App をクリックします。

![Fitbit SDKのページです。ヘッダーナビゲーションにManageリンクがあり、フォーカスするとRegister An Appリンクが表示されます。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-fitbit-01.png)

「Login」ページが表示されたら「Log In」ボタンをクリックします。

![Fitbitのログインページです。Log Inボタンを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-fitbit-02.png)

ログインフォームが表示されたら「Continue with Google」ボタンを利用するか、メールアドレスとパスワードを入力してから「Login」ボタンをクリックします。

![Fitbitのログインフォームです。Continue with Googleボタン、メールアドレス入力部、パスワード入力部、Loginボタンを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-fitbit-03.png)

「Register an application」ページが表示されたら下記の内容を入力してから「Register」ボタンをクリックします。

![Fitbitのアプリ登録ページです。Application Name入力部やDescription入力部などを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-fitbit-04.png)

- Application Name: Get Heart Rate Intraday by Date
- Description: This app allows the user to retreive heart rate intraday by date.
- Application Website URL: http://localhost:3000/
- Organization: Lorem Ipsum Co. Ltd.
- Organization Website URL: https://www.loremipsum.co.jp/
- Terms of Service URL: http://localhost:3000/terms/
- Privacy Policy URL: http://localhost:3000/privacy/
- OAuth 2.0 Application Type: Personal
- Redirect URL: http://localhost:3000/callback
- Default Access Type: Read Only
- I have read and agree to the terms of service: チェックを入れる

「Applications I registered」ページが表示されたら下記の2点を控えます。

- OAuth 2.0 Client ID
- Client Secret

![Fitbitのアプリ詳細ページです。OAuth 2.0 Client ID表示部や、Client Secret表示部を備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-fitbit-05.png)



# Webアプリのコーディング

下記のコマンドを実行してコーディングの準備をします。

```shell
mkdir column-fitbit-api
cd column-fitbit-api
npm init -y
npm install --save dotenv express node-fetch@2
touch .env main.js
```

## .env

エディタで.envを開き、前の手順で控えたOAuth2.0ClientIDとClientSecretをそれぞれFITBIT_CLIENT_IDとFITBIT_CLIENT_SECRETとして入力します。

[クリックして.envへ移動](#file-env-example)

## .main

エディタでmain.jsを開き、下記の内容を入力します。

[クリックしてmain.jsへ移動](#file-main-js)

ポイントを下記に示します。

1. アクセストークンを要求する時に必要となるランダムな文字列verifierを生成しています。
2. 認可エンドポイント（Fitbitのログインフォーム）へのリダイレクト時に必要となるchallengeを生成しています。なお、challengeはverifierのSHA-256ハッシュの [Base64URL](https://datatracker.ietf.org/doc/html/rfc4648#section-5) です。
3. /signinへのアクセスを認可エンドポイントへリダイレクトします。クエリ文字列のcode_challengeには先の手順で生成したchallengeを指定します。
4. /callbackは認可エンドポイントからリダイレクトされる時に指定されます。
5. アクセストークンを要求しています。リクエストボディのcodeにはクエリ文字列経由で渡される認可コードを指定し、リクエストボディのcode_verifierには先の手順で生成したverifierを指定します。
6. アクセストークンの取得が失敗した場合、エラーメッセージを表示して処理を中断します。
7. 心拍データを要求しています。Authorizationヘッダーに先の手順で取得したアクセストークンを指定しています。
8. 心拍データの取得が失敗した場合、エラーメッセージを表示して処理を中断します。
9. 心拍データの取得が成功した場合、取得したデータをJSON形式で出力します。Webブラウザで表示した時に改行して表示されるようにContent-Typeとしてtext/plainを指定していますが、本来はapplication/jsonの方が適しています。
10. Base64URLへ変換する関数です。
11. バッファのSHA-256ハッシュを計算する関数です。



# 動作確認

下記のコマンドを実行してWebアプリを起動します。

```shell
node -r dotenv/config main.js
```

Webブラウザで http://localhost:3000/signin にアクセスします。

![Webブラウザを起動してアドレスバーに http://localhost:3000/signin と入力しています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-check-01.png)

認可エンドポイントへリダイレクトされ、Fitbitの認証フォームが表示されたら「Continue with Google」ボタンを利用するか、メールアドレスとパスワードを入力してから「Login」ボタンをクリックします。

![Fitbitの認証フォームです。Continue with Googleボタン、メールアドレス入力部、パスワード入力部、Loginボタンを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-check-02.png)

Fitbitの認可フォームが表示されたら心拍数にチェックを入れてから「許可」ボタンをクリックします。

![Fitbitの認可フォームです。心拍数チェックボックス、拒否ボタン、許可ボタンなどを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-check-03.png)

http://localhost:3000/callback へリダイレクトされ、心拍データがページに出力されます。

![Fitbit Web APIを利用して取得した心拍数のJSONデータです。activities-heartやactivities-heart-intradayなどのプロパティを備えています。](https://gist.github.com/tatsuyasusukida/80f6a38b25547d64d4da8fddf4259f21/raw/img-check-04.png)



# おわりに

心拍数の生データ（activities-heart-intraday）を取得するにはFitbitのアプリ登録時にOAuth 2.0 Application TypeをPersonalにする必要があります。私は間違ってServerに設定してしまい期待した通りに動かず小一時間ハマってしまいました。皆さまにおかれましては貴重なお時間を費やさぬようご留意ください。最後までお読みいただきありがとうございました！
