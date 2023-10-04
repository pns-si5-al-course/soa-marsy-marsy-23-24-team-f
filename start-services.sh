#!/bin/bash
source ./utils.sh

docker compose -p soa-marsy --file mission-commander-department/docker-compose-mission-commander.yml \
                --file telemetrie-department/docker-compose-telemetrie.yml \
                --file rocket-department/docker-compose-rocket.yml \
               --file weather-department/docker-compose-weather.yml \
               --file payload-department/docker-compose-payload.yml \
                --file rocket/docker-compose-rocket-object.yml up -d


wait-for-it-to-be-up localhost:3003/isAlive telemetries-dept

wait-for-it-to-be-up localhost:3006/isAlive mission-commander-dept

wait-for-it-to-be-up localhost:3001/ rocket-dept

wait-for-it-to-be-up localhost:3002/weather weather-dept

wait-for-it-to-be-up localhost:3004/payload payload-dept

wait-for-it-to-be-up localhost:3005/ rocket-object-service