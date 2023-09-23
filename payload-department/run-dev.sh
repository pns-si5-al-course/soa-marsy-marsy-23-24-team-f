#!/bin/bash

docker build -t payload-dept-dev . -f Dockerfile.development

docker run -dp 3004:3004 payload-dept-dev