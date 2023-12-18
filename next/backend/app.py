stores = [
    {
        "name": "Store1",
        "items": [
            {
                "name": "Chair",
                "price": 15.99
            }
        ]
    }
]



from flask import Flask
app = Flask(__name__)

@app.route("/store")
def get_stores():
    return {"stores": stores}

@app.route("/")
def index():
    return "<h1>これがルート（'/'）ページです。</h1>"