#!/bin/bash
yarn build

docker build -t weather-status -f Dockerfile.production .

echo "Done building weather-department"