#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check - check the types to avoid silly mistakes
// This is a script to fix the version in package.json during DEF publishing.
// Test this file:
//
// $ BUILD_GIT_BRANCH=release/1.1.3 BUILD_ARGV_STR=--def_publish_env=daily node scripts/fixDefVersion ./package.json
// --> should fix the package.json version to 1.1.3-beta.xxxx
//
// $ BUILD_GIT_BRANCH=release/1.1.3 BUILD_ARGV_STR=--def_publish_env=prod node scripts/fixDefVersion ./package.json
// --> should fix the package.json version to 1.1.3

const fs = require('fs');
const moment = require('moment');
const program = require('commander');
const parseArgs = require('yargs-parser');

program
  .description('Fix version for def publishing TNPM packages')
  .option('--no-beta', 'no beta version', false)
  .arguments('package.json file path (only one is needed)')
  .parse(process.argv);

try {
  const packageJsonFilePath = program.args[0];
  if (!packageJsonFilePath) {
    program.help();
    process.exit(2);
  }

  const destVersion = fixVersion({
    packageJsonFilePath,
    env: process.env,
    beta: program.opts().beta,
  });

  console.log(`Fixed version to: ${destVersion}`);
} catch (err) {
  console.error('Got error: ', err);
  process.exit(1);
}

function fixVersion({ packageJsonFilePath, env = process.env, beta = true }) {
  if (!env.BUILD_GIT_BRANCH) {
    throw new Error('env.BUILD_GIT_BRANCH is required');
  }

  if (!env.BUILD_ARGV_STR) {
    throw new Error('env.BUILD_ARGV_STR is required');
  }

  const gitBranchVersion = parseBuildBranchVersion(env.BUILD_GIT_BRANCH);
  const buildArgs = parseArgs(env.BUILD_ARGV_STR);
  const buildEnv = buildArgs.def_publish_env; // daily | prod

  const destVersion =
    buildEnv === 'prod' || !beta
      ? gitBranchVersion
      : `${gitBranchVersion}-beta.${moment().format('MMDDHHmm').replace(/^0+/, '')}`;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonFilePath, 'utf-8'));

  packageJson.version = destVersion;

  if (env.BUILD_GIT_COMMITID) {
    packageJson.gitHead = env.BUILD_GIT_COMMITID;
  }

  fs.writeFileSync(packageJsonFilePath, `${JSON.stringify(packageJson, null, 2)}\n`, {
    encoding: 'utf8',
  });

  return destVersion;
}

function parseBuildBranchVersion(branchName) {
  const m = `${branchName}`.match(/\d+\.\d+\.\d+/);
  return (m && m[0]) || '';
}
