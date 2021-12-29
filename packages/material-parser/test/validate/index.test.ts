import * as fs from 'fs';
import yaml = require('js-yaml');
import path = require('path');
import {validate} from '../../src'

let fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'));
fixtures = fixtures.filter(item => !item.includes('.skip'));
if (fixtures.find(item => item.includes('.only'))) {
  fixtures = fixtures.filter(item => item.includes('.only'));
}

for (const dir of fixtures) {
  const fullPath = path.join(__dirname, 'fixtures', dir);
  test(`should be right in dir ${dir}`, async (done) => {
    const json: any = yaml.safeLoad(fs.readFileSync(path.resolve(fullPath, 'schema.json'), 'utf-8'));
    let validateResult: any;
    try {
      validateResult = validate(json)
    } catch (e) {
      validateResult = e.message;
    }
    expect(validateResult).toMatchSnapshot();
    done();
  });
}
