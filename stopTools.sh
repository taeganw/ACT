#!/bin/bash

# Check if the container exists (running or not)
if docker container inspect ctfTools > /dev/null 2>&1; then
    # Stop the container if it's running
    echo "Stopping 'ctfTools'..."
    docker stop ctfTools

    # Remove the container
    echo "Removing 'ctfTools' container..."
    docker rm ctfTools
    echo "'ctfTools' container has been successfully removed."
else
    echo "Container 'ctfTools' does not exist."
fi
