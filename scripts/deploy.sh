#!/usr/bin/env bash

WORK_DIR=$PWD
BUILD_DEST=$1

echo "Deploy ${PWD} -> ${BUILD_DEST} ..."

cd deploy-space
# basic environment preparing
tnpm install @ali/tyarn lerna
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
cp -r $WORK_DIR/packages/rax-simulator-renderer packages/rax-simulator-renderer
#cp -r $WORK_DIR/packages/editor-preset-vision packages/editor-preset-vision
cp -r $WORK_DIR/packages/engine packages/engine
cp -r $WORK_DIR/packages/vision-polyfill packages/vision-polyfill
# cp -r $WORK_DIR/packages/editor-preset-general packages/editor-preset-general
lerna bootstrap
lerna run cloud-build --stream

cd $WORK_DIR
# mv deploy-space/packages/demo/build $BUILD_DEST
mv deploy-space/packages/react-simulator-renderer/dist $BUILD_DEST
mv deploy-space/packages/rax-simulator-renderer/dist $BUILD_DEST
#mv deploy-space/packages/editor-preset-vision/dist/* $BUILD_DEST
mv deploy-space/packages/engine/dist/js $BUILD_DEST
mv deploy-space/packages/engine/dist/css $BUILD_DEST
mv deploy-space/packages/vision-polyfill/dist/js $BUILD_DEST
mv deploy-space/packages/vision-polyfill/dist/css $BUILD_DEST
# mv deploy-space/packages/editor-preset-general/dist/* $BUILD_DEST
# cp deploy-space/static/* $BUILD_DEST

echo "complete"
