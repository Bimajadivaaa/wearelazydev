#!/bin/bash

# Load environment variables
source .env
chmod +x deploy.sh

# Run the deployment script
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url ${ALCHEMY_URL} \
    --fork-url ${ALCHEMY_URL} \
    --private-key ${PRIVATE_KEY} \
    --broadcast \
    -vvvv