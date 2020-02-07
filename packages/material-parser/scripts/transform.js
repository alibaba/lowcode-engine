const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

const YamlPath = path.resolve(__dirname, '../schemas/schema.yml');
const JsonPath = path.resolve(__dirname, '../src/schema.json');
// Get document, or throw exception on error

try {
  const schema = yaml.load(fs.readFileSync(YamlPath, 'utf8'));
  ajv.compile(schema);
  fs.writeFileSync(JsonPath, JSON.stringify(schema, null, 2), 'utf-8');
  console.log('yaml file is successfully transformed into json');
} catch (e) {
  console.log(e);
  process.exit(1);
}
