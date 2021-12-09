from flask import Flask, request
import requests
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient()
client = MongoClient('mongodb://localhost:27017/')
db = client.plants
collection = db.favorites

@app.route("/plants", methods=['POST', 'GET'])
def plants():
    if request.method == 'POST':
        body = request.get_json()
        plant = body["plant"]
        API_URL = "https://tropicalfruitandveg.com/api/tfvjsonapi.php?search=" + plant
        response = requests.get(API_URL)
        return response.json()
    if request.method == 'GET':
        API_URL = "https://tropicalfruitandveg.com/api/tfvjsonapi.php?search=all"
        response = requests.get(API_URL)
        return response.json()

@app.route("/plant", methods=['POST'])
def plant():
    if request.method == 'POST':
        body = request.get_json()
        plant = body["plant"]
        API_URL = "https://tropicalfruitandveg.com/api/tfvjsonapi.php?tfvitem=" + plant
        response = requests.get(API_URL)
        return response.json()


@app.route("/recipes", methods=['POST'])
def recipes():
    body = request.get_json()
    recipe = body["recipe"]

    API_URL = "https://edamam-recipe-search.p.rapidapi.com/search?q=" + recipe
    headers = {
        'x-rapidapi-host': "edamam-recipe-search.p.rapidapi.com",
        'x-rapidapi-key': "1fb806462bmsh644af73596e24bfp18ef67jsn9c7b02e90738"
    }

    response = requests.get(API_URL, headers=headers)
    return response.json()

@app.route("/favorite", methods=['POST'])
def favorite():
    body = request.get_json();
    email = body["email"]
    tfvname = body["tfvname"]
    imageurl = body["imageurl"]
    result = collection.find_one({"email": email, "tfvname": tfvname, "imageurl": imageurl})
    if (result == None):
        result = collection.insert_one({"email": email, "tfvname": tfvname, "imageurl": imageurl})
        return {"status": "inserted"}
    else:
        result = collection.delete_one({"email": email, "tfvname": tfvname, "imageurl": imageurl})
        return {"status": "deleted"}

@app.route("/getfavorite", methods=['POST'])
def getfavorite():
    body = request.get_json();
    email = body["email"]
    tfvname = body["tfvname"]
    imageurl = body["imageurl"]
    result = collection.find_one({"email": email, "tfvname": tfvname, "imageurl": imageurl})
    print(result)
    if (result == None):
        return {"count" : 0}
    else:
        return {"count" : 1}

@app.route("/getallfavorites", methods=['POST'])
def getallfavorite():
    body = request.get_json()
    email = body["email"]
    result = collection.find({"email" : email})
    docs = []
    for doc in result:
        doc['_id'] = str(doc['_id'])
        docs.append(doc)
    if (len(docs) == 0):
        return {"count" : 0, "result": docs}
    else:
        return {"count" : len(docs), "result": docs}

if __name__ == "__main__":
    app.run(debug=True)
