# soa-marsy-marsy-23-24-team-f


## Routes disponibles

http://localhost:3000/rocket/info -> GET -> info sur le rocket
http://localhost:3001/rocket/takeoff -> POST -> 
le statut passera à "In Flight", le carburant du premier étage commencera à s'épuiser lentement (vous pouvez le consulter en rafraîchissant périodiquement rocket/info), une fois qu'il aura atteint 0%, le statut passera à "seperated", et le carburant du deuxième étage commencera à s'épuiser, une fois qu'il aura également atteint 0%, le statut deviendra "mission completed".

http://localhost:3001/rocket/setpayload -> POST -> pour définir la payload
