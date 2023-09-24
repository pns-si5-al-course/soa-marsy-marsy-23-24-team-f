#!/bin/bash

echo "Building telemetrie-department image..."

docker build -t telemetrie -f Dockerfile.production . --no-cache

echo "Done building telemetrie-department"