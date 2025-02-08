# Use the node base image
FROM node:21

# Set the working directory inside the container
WORKDIR /home/node/app

VOLUME /home/node/app

# Set environment variables
ENV NODE_ENV=production \
    LANG=en_US.UTF-8 \
    SUDO_FORCE_REMOVE=yes

# Install necessary packages
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y openssh-server python3-pip python3-venv tmux sudo &&\
    rm -rf /var/lib/apt/lists/*

# Set Passwords
RUN echo "node:node" | chpasswd &&\
    echo "root:"$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32) | chpasswd &&\
    sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
# mkdir -p /home/node/.ssh && \

# Setup SSH  
RUN echo 'Match User node' >> /etc/ssh/sshd_config && \
    echo '      ForceCommand source /home/node/app/bin/activate && tmux new-session /home/node/app/public/arsenal/run -t ' >> /etc/ssh/sshd_config

#Setup SUDO and .bashrc
RUN echo "node ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers &&\
    echo "alias a='/home/node/app/public/arsenal/run'" >> /home/node/.bashrc && \
    echo "source /home/node/app/bin/activate" >> /home/node/.bashrc &&\
    usermod -aG sudo node

# Copy the generated host keys
#COPY ./sshkeys/ssh_host_rsa_key /etc/ssh/ssh_host_rsa_key
#COPY ./sshkeys/ssh_host_ecdsa_key /etc/ssh/ssh_host_ecdsa_key
#COPY ./sshkeys/ssh_host_ed25519_key /etc/ssh/ssh_host_ed25519_key
#COPY ./sshkeys/ssh_host_rsa_key.pub /etc/ssh/ssh_host_rsa_key.pub
#COPY ./sshkeys/ssh_host_ecdsa_key.pub /etc/ssh/ssh_host_ecdsa_key.pub
#COPY ./sshkeys/ssh_host_ed25519_key.pub /etc/ssh/ssh_host_ed25519_key.pub

# Set the appropriate permissions
#RUN chmod 600 /etc/ssh/ssh_host_*_key

# Open ports 8081 For Web and 2222 for SSH
EXPOSE 8081 2222

# Change Ownership of all to node user
RUN chown -R node:node /home/node

# Copy Entrypoint file and make executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch to Node user, start npm on Container creation, and make sure it is up and Sudo is removed before every login
USER node
WORKDIR /home/node/app
CMD  /entrypoint.sh && export SUDO_FORCE_REMOVE=yes && sudo apt-get remove --purge -y sudo && bash
ENTRYPOINT  /entrypoint.sh && export SUDO_FORCE_REMOVE=yes && sudo apt-get remove --purge -y sudo && bash

