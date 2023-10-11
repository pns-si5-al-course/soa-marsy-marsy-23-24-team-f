#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'


# catching CTRL+C
trap ctrl_c INT SIGINT SIGTERM

function ctrl_c() {
    echo "Stopping services..."
    docker compose -p soa-marsy down
    echo "Done"
    exit 0
}


echo "Compiling services..."



function prepare(){
    echo "Preparing $1"
    cd $1
    ./build.sh
    cd ..
    echo -e "done building${GREEN} $1 ${NC}"
}

prepare "telemetrie-department/"
prepare "payload-department/"
prepare "rocket/"
prepare "weather-department/"
prepare "scripts/"
prepare "rocket-department/"
prepare "mission-commander-department/"


docker compose -p soa-marsy up -d

echo "--- Done Building ---"
