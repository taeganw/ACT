#!/bin/bash
git clone https://github.com/Orange-Cyberdefense/arsenal.git ./app/public/arsenal
docker build -t ctf-tools-image .