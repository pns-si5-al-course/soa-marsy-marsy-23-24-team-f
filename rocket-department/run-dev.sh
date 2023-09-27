#!/bin/bash

docker build -t rocket-dept-dev . -f Dockerfile.development

docker run -dp 3001:3001 rocket-dept-dev