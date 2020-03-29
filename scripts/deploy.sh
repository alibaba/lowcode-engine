#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

# basic environment preparing
tnpm install yarn lerna --install-node=10
export PATH=$PWD/node_modules/.bin:$PATH
node -v

# set source
yarn config set registry https://registry.npm.alibaba-inc.com

# goto workdir
cd deploy-space
mkdir packages
ln -s $WORK_DIR/packages/demo packages/demo
ln -s $WORK_DIR/packages/react-simulator-renderer packages/react-simulator-renderer
ln -s $WORK_DIR/packages/globals packages/globals
lerna bootstrap
lerna run cloud-build --stream

mv packages/demo/build $BUILD_DEST
mv packages/react-simulator-renderer/dist/* $BUILD_DEST
mv packages/globals/dist/* $BUILD_DEST

cp html/* $BUILD_DEST
echo "complete"
