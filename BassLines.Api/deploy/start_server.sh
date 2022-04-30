#!/bin/bash 
VERSION=`cat /usr/local/nvm/alias/default` 
export PATH="/usr/local/nvm/versions/node/$VERSION/bin:$PATH" 
cd /appl/basslines
pm2 start ecosystem.config.js --env production