#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
    
# Import the SSH deployment key
rm travis_ssh_key.enc # Don't need it anymore
chmod 600 travis_ssh_key
mv travis_ssh_key ~/.ssh/id_rsa

npm install -g yarn

cd src
yarn


# cd ..
# yarn prod:down
# yarn prod:up