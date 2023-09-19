#!/bin/bash
echo "Building weather-department image..."

docker build -t weather-status -f Dockerfile.production .

echo "Done building weather-department"