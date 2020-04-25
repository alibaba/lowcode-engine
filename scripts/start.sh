#!/usr/bin/env bash

# FIXME! do not run build
lerna exec --scope @ali/lowcode-react-renderer -- npm run build
lerna exec --scope @ali/lowcode-vision-polyfill -- npm start
