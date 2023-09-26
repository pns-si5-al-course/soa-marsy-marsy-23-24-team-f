## Route
http://localhost:3003/isAlive -> renvoi status 'ok' si service est up

http://localhost:3003/telemetrics -> GET, POST -> permet de poster des données telemetriques de la fusée et de les récuperer.

http://localhost:3003/ -> pour visualiser les données telemetriques



Données stockées sur bd mongodb avec le format :
{
    "name": "Marsy_1",
    "status": "In Flight",
    "stages": "[{"id": 1, "fuel": 311}, {"id": 2, "fuel": 400}]",
    "altitude": 98,
    "payload": "{"passengers": 1, "altitude": 2000, "weight": 100}",
    "timestamp": "2023-09-24T16:09:09.767168"
}
