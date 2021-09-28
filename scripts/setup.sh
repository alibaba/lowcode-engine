#!/usr/bin/env bash

tnpm i -g lerna @ali/tyarn

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap

lerna exec --stream \
  --scope @ali/lowcode-editor-core \
  --scope @ali/lowcode-types \
  --scope @ali/lowcode-utils \
  --scope @ali/lowcode-renderer-core \
  --scope @ali/lowcode-react-renderer \
  --scope @ali/lowcode-rax-renderer \
  -- npm run build
