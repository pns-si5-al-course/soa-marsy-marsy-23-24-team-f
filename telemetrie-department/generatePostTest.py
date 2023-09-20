import datetime
import random
import requests
import json
import time

url = "http://localhost:3003/rocket/telemetrics"


def getStage():
    if fuel>200:
        return 2
    elif fuel<=200 and fuel>100:
        return 1
    elif fuel==0:
        return 0


altitude = 0
fuel = 400

while True:
    altitude += random.randint(0, 10)
    fuel -= random.randint(0, 10)
    
    payload = json.dumps({
    "stages": getStage(),
    "fuel": fuel,
    "altitude": altitude,
    "timestamp": datetime.datetime.now().isoformat()
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    
    time.sleep(2)
