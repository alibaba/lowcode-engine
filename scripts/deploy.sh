#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

cd deploy-space
# basic environment preparing
tnpm install @ali/tyarn lerna --install-node=10
mv node_modules .env
export PATH=$WORK_DIR/deploy-space/.env/.bin:$PATH

echo ""
echo "Use node version:"
node -v
echo ""

# set source
# yarn config set registry https://registry.npm.alibaba-inc.com

# work
mkdir packages
# cp -r $WORK_DIR/packages/demo packages/demo
cp -r $WORK_DIR/packages/react-simulator-renderer packages/react-simulator-renderer
# cp -r $WORK_DIR/packages/editor-core packages/editor-core
cp -r $WORK_DIR/packages/vision-preset packages/vision-preset
lerna bootstrap
lerna run cloud-build --stream

cd $WORK_DIR
# mv deploy-space/packages/demo/build $BUILD_DEST
mv deploy-space/packages/react-simulator-renderer/dist $BUILD_DEST
# mv deploy-space/packages/editor-core/dist/* $BUILD_DEST
mv deploy-space/packages/vision-preset/dist/* $BUILD_DEST
cp deploy-space/static/* $BUILD_DEST

echo "complete"
