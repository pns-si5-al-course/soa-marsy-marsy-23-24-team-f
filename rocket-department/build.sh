#!/bin/bash
cd rocket-department
yarn build

docker build -t rocket-status -f Dockerfile.production . --no-cache

echo "Done building rocket-department"