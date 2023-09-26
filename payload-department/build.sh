#!/bin/bash
GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building payload-department image..."

docker build -t payload-status -f Dockerfile.production . --no-cache

echo -e "Done building ${GREEN}payload-department${NC}"