#!/bin/bash

GREEN='\033[0;32m'

# Default color
NC='\033[0m'

echo "Building scripts image..."

docker build -t scripts -f Dockerfile . --no-cache

echo -e "Done building ${GREEN}scripts${NC}"