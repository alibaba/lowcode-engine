#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

cd deploy-space
# basic environment preparing
tnpm install yarn lerna --install-node=10
mv node_modules env
export PATH=$WORK_DIR/deploy-space/env/.bin:$PATH

echo ""
echo "Use node version:"
node -v
echo ""

# set source
yarn config set registry https://registry.npm.alibaba-inc.com

# work
mkdir packages
mv $WORK_DIR/packages/demo packages/demo
mv $WORK_DIR/packages/react-simulator-renderer packages/react-simulator-renderer
mv $WORK_DIR/packages/globals packages/globals
yarn
lerna bootstrap
lerna run cloud-build --stream

cp -r packages/demo/build $BUILD_DEST
cp -r packages/react-simulator-renderer/dist/* $BUILD_DEST
cp -r packages/globals/dist/* $BUILD_DEST

cp html/* $BUILD_DEST
echo "complete"
