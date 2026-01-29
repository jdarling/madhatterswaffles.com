#!/bin/bash

docker run -p 8083:80 -v $(pwd)/dist:/usr/share/nginx/html nginx:alpine
