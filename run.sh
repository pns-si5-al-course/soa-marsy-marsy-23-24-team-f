#!/bin/bash

# make sure node is installed
if command -v node &>/dev/null; then
    node --version
else
    echo "Node.js n'est pas installé sur cette machine."
    exit 1
fi


cd mission-controller

yarn

node main.js

cd ..



