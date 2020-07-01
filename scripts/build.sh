#!/usr/bin/env bash

lerna run build --stream
cp -R ./packages/react-simulator-renderer/dist/* ./packages/editor-preset-general/dist
cp -R ./packages/react-simulator-renderer/dist/* ./packages/editor-preset-vision/dist
