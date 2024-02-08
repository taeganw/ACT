#!/bin/bash

# Check if the container exists (running or not)
if docker container inspect ctfTools > /dev/null 2>&1; then
    echo "Container 'ctfTools' already exists."

    # Check if the container is not running
    if [ "$(docker container inspect -f '{{.State.Running}}' ctfTools)" = "false" ]; then
        echo "Starting 'ctfTools'..."
        docker start ctfTools
    else
        echo "'ctfTools' is already running."
    fi
else
    # Container doesn't exist, so start a new one
    echo "Creating and starting a new container named 'ctfTools'..."
    docker run -v $(pwd)/app:/home/node/app -it -d --name ctfTools -p 8081:8081 -p 2222:2222 ctf-tools-image
fi
