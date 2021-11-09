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


if __name__ == "__main__":
    app.run(debug=True)
