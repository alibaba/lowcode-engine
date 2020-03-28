#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

# build globals
echo "build globals"
cd packages/globals
tnpm ii
tnpm run build
cd $WORK_DIR
mv packages/globals/dist $BUILD_DEST

# build simulator-renderer
echo "build simulator-renderer"
cd packages/react-simulator-renderer
tnpm ii
tnpm run build
cd $WORK_DIR
mv packages/react-simulator-renderer/dist/* $BUILD_DEST

echo "complete"
