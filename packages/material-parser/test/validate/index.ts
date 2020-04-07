import Ajv from 'ajv';
import test from 'ava';

import fs = require('fs');
import yaml = require('js-yaml');
import path = require('path');
const schema = yaml.load(fs.readFileSync(path.resolve(__dirname, '../../schemas/schema.yml'), 'utf8'));
const ajv = new Ajv({jsonPointers: true});
const validate = ajv.compile(schema);

let fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'));
fixtures = fixtures.filter(item => !item.includes('.skip'));
if (fixtures.find(item => item.includes('.only'))) {
  fixtures = fixtures.filter(item => item.includes('.only'));
}

for (const dir of fixtures) {
  const fullPath = path.join(__dirname, 'fixtures', dir);
  test(`should be right in dir ${dir}`, async (t) => {
    const json = yaml.safeLoad(fs.readFileSync(path.resolve(fullPath, 'schema.json'), 'utf-8'));
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

    t.snapshot(validateResult);
  });
}