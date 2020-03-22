#!/bin/bash

set -x
# if [ $TRAVIS_BRANCH == 'master' ] ; then
#     git init
        
#     git remote add deploy "root@146.185.133.5:/var/www/free-pooch"
#     git config user.name "Travis CI"
#     git config user.email "marciodesousa16+travisCI@gmail.com"
    
#     git add .
#     git commit -m "Deploy"
#     git push --force deploy master
# else
#     echo "Not deploying, since this branch isn't master."
# fi
cd ..
tar -czf album-cover.tgz ./random-album-cover && \
scp album-cover.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./album-cover/deploy/untar.sh
