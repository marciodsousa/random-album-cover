#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)
    
# Import the SSH deployment key
rm do_deploy_key.enc # Don't need it anymore
chmod 600 do_deploy_key
mv do_deploy_key ~/.ssh/id_rsa

npm install -g yarn

cd src
yarn


# cd ..
# yarn prod:down
# yarn prod:up