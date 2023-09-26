#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building rocket-service image..."

docker build --no-cache -t rocket-object-service -f Dockerfile.production .

echo -e "Done building ${GREEN} rocket-service${NC}"
