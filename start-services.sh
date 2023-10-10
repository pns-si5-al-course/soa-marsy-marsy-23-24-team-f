#!/bin/bash
source ./utils.sh


wait-for-it-to-be-up localhost:3003/isAlive telemetries-dept

wait-for-it-to-be-up localhost:3006/isAlive mission-commander-dept

wait-for-it-to-be-up localhost:3001/ rocket-dept

wait-for-it-to-be-up localhost:3002/weather weather-dept

wait-for-it-to-be-up localhost:3004/payload payload-dept

wait-for-it-to-be-up localhost:3005/ rocket-object-service