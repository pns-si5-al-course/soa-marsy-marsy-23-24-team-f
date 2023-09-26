#!/bin/bash
cd rocket-department

echo "Building rocket-department image..."

docker build -t rocket-status -f Dockerfile.production .

echo "Done building rocket-department"