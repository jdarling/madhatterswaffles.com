#!/bin/bash

declare PORT=${1:-8083}
declare WD=$(pwd)
declare SRC_DIR="${WD}/docs"
echo "Starting on port: ${PORT}"
docker run -p ${PORT}:80 -v ${SRC_DIR}:/usr/share/nginx/html nginx:alpine