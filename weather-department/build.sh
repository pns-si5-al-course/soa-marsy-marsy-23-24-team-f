#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building weather-department image..."

docker build -t weather-status -f Dockerfile.production .

echo -e "Done building ${GREEN}weather-department${NC}"