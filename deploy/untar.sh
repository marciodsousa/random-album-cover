# export NODE_ENV=production
# export NVM_BIN=$HOME/.nvm/versions/node/v6.9.0/bin

cd ~/temp_ci && \
tar zxf album-cover.tgz -C . && \
rm album-cover.tgz
mv random-album-cover /usr/share/nginx/html/album-cover/versions/$1
ln -sfn /usr/share/nginx/html/album-cover/versions/$1/src /usr/share/nginx/html/album-cover/current
cd /usr/share/nginx/html/album-cover/current && yarn prod-reload