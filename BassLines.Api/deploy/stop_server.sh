#!/bin/bash 
VERSION=`cat /usr/local/nvm/alias/default` 
export PATH="/usr/local/nvm/versions/node/$VERSION/bin:$PATH" 
pm2 delete basslines