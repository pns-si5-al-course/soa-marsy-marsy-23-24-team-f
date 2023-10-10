#!/bin/bash

echo "Compiling services..."

docker compose up -d

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh