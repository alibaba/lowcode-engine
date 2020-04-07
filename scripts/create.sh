#!/usr/bin/env bash

DIR_NAME=$1

if [ -z $DIR_NAME ];then
  echo 'Usage: ./create.sh <folder-name>'
  exit 0
fi

if [ -d packages/$DIR_NAME ];then
  echo 'Folder is existing!'
  exit 0
fi

mkdir packages/$DIR_NAME

cp -r templates/* packages/$DIR_NAME

mv packages/$DIR_NAME/_tsconfig.json packages/$DIR_NAME/tsconfig.json

echo 'Add package successfully.'
