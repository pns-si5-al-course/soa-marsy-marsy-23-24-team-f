#!/bin/bash

echo "Building rocket-service image..."

docker build --no-cache -t rocket-object-service -f Dockerfile.production .

echo "Done building rocket-service"
