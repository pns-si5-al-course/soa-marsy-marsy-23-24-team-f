#!/bin/bash

docker build -t weather-dept-dev . -f Dockerfile.development

docker run -dp 3002:3002 weather-dept-dev