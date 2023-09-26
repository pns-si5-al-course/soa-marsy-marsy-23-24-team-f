#!/bin/bash

GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building telemetrie-department image..."

docker build -t telemetrie -f Dockerfile.production . --no-cache

echo -e "Done building ${GREEN}telemetrie-department${NC}"