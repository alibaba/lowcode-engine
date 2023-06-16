#!/usr/bin/env node
/* eslint-disable no-var */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable @typescript-eslint/no-require-imports */

var program = require('commander');

program
  .command('generate', { isDefault: true })
  .description('Generate code from ali lowcode schema')
  .requiredOption('-s, --solution <solution>', 'specify the solution to use (icejs/rax/recore)')
  .option('-i, --input <input>', 'specify the input schema file')
  .option('-o, --output <output>', 'specify the output directory', 'generated')
  .option('-c, --cwd <cwd>', 'specify the working directory', '.')
  .option('-q, --quiet', 'be quiet, do not output anything unless get error', false)
  .option('-v, --verbose', 'be verbose, output more information', false)
  .option('--solution-options <options>', 'specify the solution options', '{}')
  .arguments('[input-schema] ali lowcode schema JSON file')
  .action(function doGenerate(inputSchema, command) {
    var options = command.opts();
    if (options.cwd) {
      process.chdir(options.cwd);
    }

    require('../dist/cli')
      .run(inputSchema ? [inputSchema] : [], options)
      .then((retCode) => {
        process.exit(retCode);
      });
  });

program
  .command('init-solution')
  .option('-c, --cwd <cwd>', 'specify the working directory', '.')
  .option('-q, --quiet', 'be quiet, do not output anything unless get error', false)
  .option('-v, --verbose', 'be verbose, output more information', false)
  .arguments('<your-solution-name>')
  .action(function initSolution(solutionName, command) {
    var options = command.opts();
    if (options.cwd) {
      process.chdir(options.cwd);
    }

    require('../dist/cli')
      .initSolution([solutionName], options)
      .then((retCode) => {
        process.exit(retCode);
      });
  });

program.parse(process.argv);

