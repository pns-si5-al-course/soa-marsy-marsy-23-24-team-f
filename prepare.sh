#!/bin/bash

echo "Compiling services..."

prepare "scripts"


docker compose -p soa-marsy up -d

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh