# export NODE_ENV=production
# export NVM_BIN=$HOME/.nvm/versions/node/v6.9.0/bin

cd /usr/share/nginx/html/album-cover && \
rm -r album-cover
tar zxf album-cover.tgz -C . && \
rm album-cover.tgz
cd album-cover
yarn prod:reload