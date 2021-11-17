from flask import Flask, request
import requests

app = Flask(__name__)

'''
 GET ALL PLANTS or SEARCH FOR ALL PLANTS THAT MATCH A TEXT
'''


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


@app.route("/recipes", methods=['GET'])
def recipes():
    body = request.get_json()
    recipe = body["recipe"]

    API_URL = "https://edamam-recipe-search.p.rapidapi.com/search?q=" + recipe
    headers = {
        'x-rapidapi-host': "edamam-recipe-search.p.rapidapi.com",
        'x-rapidapi-key': "1fb806462bmsh644af73596e24bfp18ef67jsn9c7b02e90738"
    }

    response = requests.get(API_URL, params=headers)
    return response.json()

    # response = requests.request("GET", url, headers=headers, params=querystring)


if __name__ == "__main__":
    app.run(debug=True)
