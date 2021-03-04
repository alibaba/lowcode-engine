#!/usr/bin/env bash

tnpm i -g lerna @ali/tyarn

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap

lerna exec --scope @ali/lowcode-types -- npm run build
lerna exec --scope @ali/lowcode-utils -- npm run build
lerna exec --scope @ali/lowcode-renderer-core -- npm run build
lerna exec --scope @ali/lowcode-react-renderer -- npm run build
lerna exec --scope @ali/lowcode-rax-renderer -- npm run build
