#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

if [ ! -d "$BUILD_DEST" ]; then
  mkdir -p "$BUILD_DEST"
fi

tnpm i -g n
echo "Switch node version to 14"
n 14
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


# mv deploy-space/packages/demo/build $BUILD_DEST
mv ./packages/react-simulator-renderer/dist/* $BUILD_DEST
mv ./packages/rax-simulator-renderer/dist/* $BUILD_DEST
#mv deploy-space/packages/editor-preset-vision/dist/* $BUILD_DEST
mv ./packages/engine/dist/js/* $BUILD_DEST
mv ./packages/engine/dist/css/* $BUILD_DEST
mv ./packages/vision-polyfill/dist/js/* $BUILD_DEST
mv ./packages/vision-polyfill/dist/css/* $BUILD_DEST
# mv deploy-space/packages/editor-preset-general/dist/* $BUILD_DEST
# cp deploy-space/static/* $BUILD_DEST

echo "Complete"
