#!/usr/bin/env bash

npm i -g lerna @ali/tyarn

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap
