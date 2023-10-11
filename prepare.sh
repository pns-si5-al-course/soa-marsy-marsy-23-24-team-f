#!/bin/bash

echo "Compiling services..."

docker compose -p soa-marsy up -d

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh