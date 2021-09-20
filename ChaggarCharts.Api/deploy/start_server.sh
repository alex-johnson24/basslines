#!/bin/bash 
VERSION=`cat /usr/local/nvm/alias/default` 
export PATH="/usr/local/nvm/versions/node/$VERSION/bin:$PATH" 
cd /appl/chaggarcharts
pm2 start ecosystem.config.js --env production