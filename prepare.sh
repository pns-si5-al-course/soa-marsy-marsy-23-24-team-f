#!/bin/bash

function prepare() {
    # Install dependencies
    cd $1
    ./build.sh
    cd ..
}

echo "Creating network..."

docker network create rocket-network

echo "Compiling services..."

prepare "mission-commander-department"

prepare "telemetrie-department"

prepare "weather-department"

prepare "rocket-department"

prepare "rocket" 

prepare "payload-department"

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh