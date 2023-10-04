#!/bin/bash
source ./utils.sh

line_count=$(docker images | grep "rocket-status" | wc -l)

#get lenght of the return of shell command (docker images)
if [ "$line_count" -eq 0 ]; then
    echo "rocket-status image not found.."
    echo "Building rocket-status..."
    ./prepare.sh
fi

line_count=$(docker images | grep "weather-status" | wc -l)

#get lenght of the return of shell command (docker images)
if [ "$line_count" -eq 0 ]; then
    echo "weather-status image not found.."
    echo "Building weather-status..."
    ./prepare.sh
fi

line_count=$(docker images | grep "rocket-object-service" | wc -l)

if [ "$line_count" -eq 0 ]; then
    echo "rocket-object-service image not found.."
    echo "Building rocket-object-service..."
    ./prepare.sh
fi

line_count=$(docker images | grep "payload-status" | wc -l)

#get lenght of the return of shell command (docker images)
if [ "$line_count" -eq 0 ]; then
    echo "payload-status image not found.."
    echo "Building payload-status..."
    ./prepare.sh
fi

line_count=$(docker images | grep "mission-commander" | wc -l)

if [ "$line_count" -eq 0 ]; then
    echo "mission-commander-service image not found.."
    echo "Building mission-commander-service..."
    ./prepare.sh
fi

docker-compose -p soa-marsy --file mission-commander-department/docker-compose-mission-commander.yml \
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