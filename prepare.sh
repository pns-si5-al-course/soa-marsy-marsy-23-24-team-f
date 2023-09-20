#!/bin/bash

function prepare() {
    # Install dependencies
    cd $1
    ./build.sh
    cd ..
}
echo "Compiling services..."

prepare "weather-department"

prepare "rocket-department"

prepare "telemetrie-department"

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh