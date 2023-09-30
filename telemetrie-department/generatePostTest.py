import datetime
import random
import requests
import json
import time
from math import log

url = "http://localhost:3003/rocket/telemetrics"


def getStage():
    if stages[0]["fuel"] > 0 :
        return 2
    elif stages[0]["fuel"] <=0 and stages[0]["fuel"] > 0:
        return 1
    else:
        return 0

def getStatus():
    if altitude > 10:
        return "In Flight"
    else:
        return "Grounded"


altitude = 0
# fuel = json.loads('{"Stage 1": 400, "Stage 2": 400}')
stages = [{"id": 1, "fuel": 400}, {"id": 2, "fuel": 400}]
speed = 0.0

while True:
    speed += 10
    altitude += random.randint(0, 10)
    stages[0]["fuel"] -= random.randint(0, 10)
    if (stages[0]["fuel"] <= 0):
        stages[0]["fuel"] = 0 
        stages[1]["fuel"] -= random.randint(0, 10)
    
    payload = json.dumps({
    "name": "Marsy_1",
    "status": getStatus(),
    "stages": stages,
    "altitude": altitude,
    "payload": {"passengers": 1, "altitude": 2000, "weight": 100, "speed": speed, "status": "In Flight"},
    "speed": speed,
    "timestamp": datetime.datetime.now().isoformat()
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    
    print(payload)
    
    time.sleep(2)
