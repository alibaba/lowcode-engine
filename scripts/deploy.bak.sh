#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

# build globals
echo "build globals"
cd packages/globals
tnpm ii
tnpm run cloud-build
cd $WORK_DIR

# build simulator-renderer
echo "build simulator-renderer"
cd packages/react-simulator-renderer
tnpm ii
tnpm run cloud-build
cd $WORK_DIR

# build lowcode demo
echo "build lowcode demo"
cd packages/demo
# FIXME! npm is slow, but tnpm has a depends bug
npm i --registry=http://registry.npm.alibaba-inc.com
npm run cloud-build
cd $WORK_DIR

mv packages/demo/build $BUILD_DEST
mv packages/react-simulator-renderer/dist/* $BUILD_DEST
mv packages/globals/dist/* $BUILD_DEST

cp deploy-space/html/* $BUILD_DEST
echo "complete"
