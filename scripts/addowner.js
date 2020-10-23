#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const process = require('process');
const { execSync } = require('child_process');

// eslint-disable-next-line prefer-const
let [owner, pkg] = process.argv.slice(2);

const packages_dir = path.join(__dirname, '..', 'packages');
function getPackageNames() {
  const ls = fs.readdirSync(packages_dir, 'utf-8');
  const packageNames = [];
  ls.forEach((item) => {
    if (item.charAt(0) === '.') {
      return;
    }
    const packageJsonFile = path.join(packages_dir, item, 'package.json');

    if (fs.existsSync(packageJsonFile)) {
      const json = require(packageJsonFile);
      if (!json.private && json.name) {
        packageNames.push(json.name);
      }
    }
  });
  return packageNames;
}

const owners_file = path.join(__dirname, './owners.json');
const owners = require(owners_file);
function addPackageOwners(packageName) {
  owners.forEach(setOwner => addOwner(packageName, setOwner));
}

function addOwner(packageName, setOwner) {
  console.info(`addowner "${setOwner}" for "${packageName}"`);
  try {
    execSync(`tnpm owner add ${setOwner} ${packageName}`, {
      encoding: 'utf-8',
    });
    console.info('OK');
  } catch (e) {
    console.info(e);
  }
}

if (pkg) {
  const packageJsonFile = path.join(packages_dir, pkg, 'package.json');

  if (fs.existsSync(packageJsonFile)) {
    const json = require(packageJsonFile);
    if (!json.private && json.name) {
      pkg = json.name;
    }
  }
  if (owner === '-') {
    addPackageOwners(pkg);
  } else {
    addOwner(pkg, owner);
  }
} else if (owner) {
  getPackageNames().forEach(packageName => {
    addOwner(packageName, owner);
  });
} else {
  const pkgs = getPackageNames();
  pkgs.forEach(packageName => {
    addPackageOwners(packageName);
  });
}
