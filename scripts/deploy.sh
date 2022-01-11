#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

if [ ! -d "$BUILD_DEST" ]; then
  mkdir -p "$BUILD_DEST"
fi

tnpm i -g n
# 使用官方源有较大概率会 block
export N_NODE_MIRROR=https://npm.taobao.org/mirrors/node

echo "Switch node version to 14"
n 14.17.0
echo "Node Version"
node -v

echo "Deploy ${WORK_DIR} -> ${BUILD_DEST} ..."

echo "Clean"
tnpm run clean

echo "Setup"
tnpm run setup

# set source
# yarn config set registry https://registry.npm.alibaba-inc.com

lerna run cloud-build --stream

mv ./packages/react-simulator-renderer/dist/js/* $BUILD_DEST
mv ./packages/react-simulator-renderer/dist/css/* $BUILD_DEST
mv ./packages/rax-simulator-renderer/dist/js/* $BUILD_DEST
mv ./packages/rax-simulator-renderer/dist/css/* $BUILD_DEST
mv ./packages/engine/dist/js/* $BUILD_DEST
mv ./packages/engine/dist/css/* $BUILD_DEST
mv ./packages/react-renderer/dist/js/* $BUILD_DEST
mv ./packages/react-renderer/dist/css/* $BUILD_DEST
mv ./packages/vision-polyfill/dist/js/* $BUILD_DEST
mv ./packages/vision-polyfill/dist/css/* $BUILD_DEST

echo "Complete"
