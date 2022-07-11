#!/usr/bin/env bash

lerna run build \
  --scope @alilc/lowcode-types \
  --scope @alilc/lowcode-utils \
  --scope @alilc/lowcode-shell \
  --scope @alilc/lowcode-editor-core \
  --scope @alilc/lowcode-editor-skeleton \
  --scope @alilc/lowcode-designer \
  --scope @alilc/lowcode-plugin-designer \
  --scope @alilc/lowcode-plugin-outline-pane \
  --scope @alilc/lowcode-rax-renderer \
  --scope @alilc/lowcode-rax-simulator-renderer \
  --scope @alilc/lowcode-react-renderer \
  --scope @alilc/lowcode-react-simulator-renderer \
  --scope @alilc/lowcode-renderer-core \
  --scope @alilc/lowcode-engine \
  --stream

lerna run build:umd \
  --scope @alilc/lowcode-engine \
  --scope @alilc/lowcode-rax-simulator-renderer \
  --scope @alilc/lowcode-react-simulator-renderer \
  --scope @alilc/lowcode-react-renderer \
  --stream

cp ./packages/react-simulator-renderer/dist/js/* ./packages/engine/dist/js/
cp ./packages/react-simulator-renderer/dist/css/* ./packages/engine/dist/css/

cp ./packages/rax-simulator-renderer/dist/js/* ./packages/engine/dist/js/
cp ./packages/rax-simulator-renderer/dist/css/* ./packages/engine/dist/css/