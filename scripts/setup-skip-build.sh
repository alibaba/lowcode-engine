#!/usr/bin/env bash

rm -rf node_modules package-lock.json yarn.lock

npm i lerna@4.0.0

lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap
