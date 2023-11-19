node run.scenario.js 1 $1
curl -X POST http://rocket-service:3001/stop-simulation
node run.scenario.js 2 
curl -X POST http://rocket-service:3001/stop-simulation
sleep 5
node run.scenario.js 3 