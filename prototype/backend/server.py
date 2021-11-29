from flask import Flask, request, jsonify
import requests
import os
import pathlib
from flask import Flask, session, abort, redirect, request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = "Remember2EatFruits:)"
GOOGLE_CLIENT_ID = "257365493228-jd74c6qimgo4pocp9h7cko2s222pcg9r.apps.googleusercontent.com"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://127.0.0.1:5000/callback"
)
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

    response = requests.get(API_URL, headers=headers)
    return response.json()

    # response = requests.request("GET", url, headers=headers, params=querystring)

@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return jsonify(authorization_url)
@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    return id_info

@app.route("/loggedin")
def loggedin():
    return "Hello World"

if __name__ == "__main__":
    app.run(debug=True)
