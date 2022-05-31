#!/usr/bin/env node
const os = require('os');
const del = require('del');
const gulp = require('gulp');
const shell = require('shelljs');

async function deleteRootDirLockFile() {
    await del('package-lock.json');
    await del('yarn.lock');
}

async function clean() {
    await shell.exec('lerna clean -y');
}

async function deletePackagesDirLockFile() {
    await del('packages/**/package-lock.json');
}

async function bootstrap() {
    await shell.exec('lerna bootstrap --force-local');
}

const setup = gulp.series(deleteRootDirLockFile, clean, deletePackagesDirLockFile, bootstrap);

os.type() === 'Windows_NT' ? setup() : shell.exec('scripts/setup.sh');