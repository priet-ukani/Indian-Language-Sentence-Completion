# Importing required packages
import requests
import json

# Composing a payload for API
payload = {'text': 'పుట్టిన రోజు '}
# Defining content type for our payload
headers = {'Content-type': 'application/json'}
# Sending a post request to the server (API)j
response = requests.post(url="https://957f-218-185-248-66.ngrok-free.app", data=json.dumps(payload), headers=headers)
# Printing out the response of API
print(response.text)    

