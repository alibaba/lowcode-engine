#!/usr/bin/env bash

pkgName="@ali/lowcode-ignitor"

if [ "$1" ]; then
  pkgName="$1"
fi

lerna exec --scope $pkgName -- npm start
