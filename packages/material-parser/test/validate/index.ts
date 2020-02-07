import test from 'ava';
import Ajv from 'ajv';
import betterAjvErrors from 'better-ajv-errors';

import fs = require('fs');
import yaml = require('js-yaml');
import path = require('path');
const schema = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../schemas/schema.yml'), 'utf8'));
const ajv = new Ajv({jsonPointers: true});
const validate = ajv.compile(schema);

const shouldUpdate = process.env.UPDATE || false;

let fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'));
fixtures = fixtures.filter(item => !item.includes('.skip'));
if (fixtures.find(item => item.includes('.only'))) {
  fixtures = fixtures.filter(item => item.includes('.only'));
}

for (const dir of fixtures) {
  const fullPath = path.join(__dirname, 'fixtures', dir);
  test(`should be right in dir ${dir}`, async (t) => {
    const json = yaml.safeLoad(fs.readFileSync(path.resolve(fullPath, 'src.json'), 'utf-8'));
    const result = JSON.parse(fs.readFileSync(path.resolve(fullPath, 'result.json'), 'utf-8'));
    let validateResult: any = validate(json);
    if (validateResult === true) {
      validateResult = {
        success: true,
      };
    } else {
      validateResult = {
        success: false,
        errors: validate.errors,
      };
    }

    if (shouldUpdate) {
      fs.writeFileSync(
        path.resolve(fullPath, 'result.json'),
        JSON.stringify(validateResult, null, 2),
        'utf-8',
      );
    } else {
      t.deepEqual(validateResult, result);
    }

    if (validate.errors && validateResult.success === false && result.success === true) {
      const output = betterAjvErrors(schema, json, validate.errors, {indent: 2});
      console.log(output);
    }
  });
}