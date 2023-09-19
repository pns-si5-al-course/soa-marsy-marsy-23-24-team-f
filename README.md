# soa-marsy-marsy-23-24-team-f


## Routes disponnibles

http://localhost:3001/rocket -> GET -> renvoi "ok" si le service est UP.
http://localhost:3001/status -> GET, POST -> 
* sur un GET renvoi "GO" si la requête contient le token d'authorisation correct, sinon renvoi un 401 'Unauthorized access'.
* sur un POST, si le token d'auth est correct, et que le message contenu dans le body de la requete est "GO", renvoi un message indiquant que la fusée est lancée, si le token est incorrect, renvoi un renvoi un 401 'Unauthorized access'.

http://localhost:3002/weather -> GET -> renvoi "ok" si le service est UP.
http://localhost:3002/status -> GET -> renvoi "GO" si la requête contient le token d'authorisation correct, sinon renvoi un 401 'Unauthorized access'.


