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

docker-compose --file rocket-department/rocket-department/docker-compose-rocket.yml \
               --file weather-department/docker-compose-weather.yml \
               --file payload-department/docker-compose-payload.yml \
               --file telemetrie-department/docker-compose-telemetrie.yml \
                --file rocket/docker-compose-rocket-object.yml up -d

wait-for-it-to-be-up localhost:3001/rocket rocket-dept

wait-for-it-to-be-up localhost:3002/weather weather-dept

wait-for-it-to-be-up localhost:3003/isAlive telemetries-dept

wait-for-it-to-be-up localhost:3005/ rocket-object-service



wait-for-it-to-be-up localhost:3004/payload payload-dept