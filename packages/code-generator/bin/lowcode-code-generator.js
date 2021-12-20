#!/usr/bin/env node
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-require-imports */

var program = require('commander');

program
  .description('Generate code from ali lowcode schema')
  .requiredOption('-s, --solution <solution>', 'specify the solution to use (icejs/rax/recore)')
  .option('-i, --input <input>', 'specify the input schema file')
  .option('-o, --output <output>', 'specify the output directory', 'generated')
  .option('-c, --cwd <cwd>', 'specify the working directory', '.')
  .option('-q, --quiet', 'be quiet, do not output anything unless get error', false)
  .arguments('ali lowcode schema JSON file')
  .parse(process.argv);

var options = program.opts();
if (options.cwd) {
  process.chdir(options.cwd);
}

require('../lib/cli')
  .run(program.args, options)
  .then((retCode) => {
    process.exit(retCode);
  });
