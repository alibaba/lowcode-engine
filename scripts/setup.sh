#!/usr/bin/env bash

tnpm i -g lerna @ali/tyarn tsc

rm -rf node_modules package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap
