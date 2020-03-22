# export NODE_ENV=production
# export NVM_BIN=$HOME/.nvm/versions/node/v6.9.0/bin

cd ~/temp_ci && \
tar zxf album-cover.tgz -C . && \
rm album-cover.tgz
mv random-album-cover /usr/share/nginx/html/album-cover/versions/
cd /usr/share/nginx/html/album-cover/versions/random-album-cover