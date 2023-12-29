stores = [
  {
    "name":"Store1",
    "items":[
        {
          "name":"Chair",
          "price":15.99
        }
    ]
  }
]

from flask import Flask
import requests
app = Flask(__name__)

@app.route("/srore")
def get_stores():
  return {"stores":stores}

@app.route("/fetchtest")
def fetchtest():
  res = requests.get('https://jsonplaceholder.typicode.com/users')
  return res.json(), 200

if __name__ == "__main__":
    app.run(debug=True)
    


@app.route("/fetchtest")
def fetchtest():
    token = 'your_access_token'
    headers = {'Authorization': 'Bearer ' + token}
    response = requests.get('https://your-api-url.com/data', headers=headers)
    return response.json(), response.status_code





