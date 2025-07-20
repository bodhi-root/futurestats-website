FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

# Install Git LFS
RUN apt-get update \
  && apt-get install -y git-lfs \
  && git lfs install

# Install Node.js LTS 18
RUN npm install -g n && n 18

# Install Gatsby CLI globally
RUN npm install -g gatsby-cli

# Set NODE_OPTIONS to enable OpenSSL legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider
