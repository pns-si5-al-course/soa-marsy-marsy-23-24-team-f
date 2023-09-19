#!/bin/bash
echo "Building weather-department image..."

docker build -t weather-status -f Dockerfile.production . --no-cache

echo "Done building weather-department"