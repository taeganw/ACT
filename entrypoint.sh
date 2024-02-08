#!/bin/bash

# Define the path to the venv
VENV_PATH="/home/node/app"

# Start SSH if it is not started
sudo /etc/init.d/ssh start

# Remove Node user from the sudoers file
# sudo sed -i 's/node ALL=(ALL) NOPASSWD: ALL//' /etc/sudoers

#Remove Sudo
sudo rm -f /usr/bin/sudo 

# Check if the virtual environment directory exists, if not make it
if [ ! -f "$VENV_PATH/bin/activate" ]; then
    echo "Virtual environment not found. Creating one at $VENV_PATH..."
    python3 -m venv "$VENV_PATH"
else
    echo "Virtual environment already exists at $VENV_PATH"
fi

# Activate the virtual environment
source "$VENV_PATH/bin/activate"

# Try and install Requirements
python3 -m pip install -r /home/node/app/public/arsenal/requirements.txt

# Check if 'npm start' is already running
if pgrep -f "node.*npm start" > /dev/null; then
    echo "The 'npm start' process is already running."
else
    # echo "Starting 'npm start'..."
    # # Navigate to your project directory if needed
    # cd /home/node/app
    # Use 'npm start' to start your application
    npm start
    echo "'npm start' has been started."
fi




