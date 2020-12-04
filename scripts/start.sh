#!/usr/bin/env bash

lerna exec --scope @ali/lowcode-react-renderer -- npm build
lerna exec --scope @ali/lowcode-rax-renderer -- npm build
lerna exec --scope @ali/lowcode-ignitor -- npm start
