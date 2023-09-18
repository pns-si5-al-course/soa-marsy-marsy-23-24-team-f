#!/bin/bash
source ./utils.sh

line_count=$(docker images | grep "rocket-status" | wc -l)

#get lenght of the return of shell command (docker images)
if [ "$line_count" -eq 0 ]; then
    echo "rocket-status image not found.."
    echo "Building rocket-status..."
    ./prepare.sh
fi

docker run -dp 3001:3001 rocket-status

wait-for-it-to-be-up localhost:3001/rocket rocket-dept

line_count=$(docker images | grep "weather-status" | wc -l)

#get lenght of the return of shell command (docker images)
if [ "$line_count" -eq 0 ]; then
    echo "weather-status image not found.."
    echo "Building weather-status..."
    ./prepare.sh
fi

docker run -dp 3002:3002 weather-status

wait-for-it-to-be-up localhost:3002/weather weather-dept