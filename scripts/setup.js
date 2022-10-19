#!/usr/bin/env node
const os = require('os');
const del = require('del');
const gulp = require('gulp');
const execa = require('execa');

async function deleteRootDirLockFile() {
    await del('package-lock.json');
    await del('yarn.lock');
}

async function clean() {
    await execa.command('lerna clean -y', { stdio: 'inherit', encoding: 'utf-8' });
}

async function deletePackagesDirLockFile() {
    await del('packages/**/package-lock.json');
}

async function bootstrap() {
    await execa.command('lerna bootstrap --force-local', { stdio: 'inherit', encoding: 'utf-8' });
}

const setup = gulp.series(deleteRootDirLockFile, clean, deletePackagesDirLockFile, bootstrap);

os.type() === 'Windows_NT' ? setup() : execa.command('scripts/setup.sh', { stdio: 'inherit', encoding: 'utf-8' });