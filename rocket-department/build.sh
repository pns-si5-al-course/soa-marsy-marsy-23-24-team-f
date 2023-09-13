#!/bin/bash
cd rocket-department
yarn build

docker build -t rocket-status -f Dockerfile.production .

echo "Done building rocket-department"