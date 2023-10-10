#!/bin/bash

echo "Compiling services..."

prepare "scripts"


docker compose up -d

echo "--- Done Building ---"

echo "--- Starting services ---"

./start-services.sh