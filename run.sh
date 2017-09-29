#!/bin/bash
docker run -d -p 80:80 --name dz-playlist-app -v "$PWD/src":/var/www/html php:7.1-apache