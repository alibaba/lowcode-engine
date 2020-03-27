#!/usr/bin/env bash

rm -rf node_modules package-lock.json
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

yarn install
npm run bootstrap
