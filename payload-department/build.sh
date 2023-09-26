#!/bin/bash
echo "Building payload-department image..."

docker build -t payload-status -f Dockerfile.production . --no-cache

echo "Done building payload-department"