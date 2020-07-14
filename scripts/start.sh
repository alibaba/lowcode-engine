#!/usr/bin/env bash

# FIXME! do not run build
lerna exec --scope @ali/lowcode-rax-renderer -- npm run build
lerna exec --scope @ali/lowcode-react-renderer -- npm run build
lerna exec --scope @ali/lowcode-demo -- npm start
