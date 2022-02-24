#!/usr/bin/env bash

rm -rf package-lock.json yarn.lock
lerna clean -y
find ./packages -type f -name "package-lock.json" -exec rm -f {} \;

lerna bootstrap --force-local
