#!/bin/bash

function prepare() {
    # Install dependencies
    cd $1
    ./build.sh
    cd ..
}
echo "Compiling services..."

prepare "rocket-department"

echo "--- Done Building ---"



