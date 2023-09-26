#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'

cd rocket-department

echo "Building rocket-department image..."

docker build -t rocket-status -f Dockerfile.production .

echo -e "Done building ${GREEN}rocket-department${NC}"