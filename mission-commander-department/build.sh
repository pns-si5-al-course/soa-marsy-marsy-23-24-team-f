#!/bin/bash

GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building mission-commander-department image..."

docker build -t mission-commander -f Dockerfile.production . --no-cache

echo -e "Done building ${GREEN}mission-commander-department${NC}"