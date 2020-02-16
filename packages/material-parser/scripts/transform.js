const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const { compile } = require('json-schema-to-typescript');

const ajv = new Ajv();

const YamlPath = path.resolve(__dirname, '../schemas/schema.yml');
const JsonPath = path.resolve(__dirname, '../src/validate/schema.json');
const tsPath = path.resolve(__dirname, '../src/otter-core/schema/types.ts');
// Get document, or throw exception on error

(async function() {
  try {
    const schema = yaml.load(fs.readFileSync(YamlPath, 'utf8'));
    ajv.compile(schema);
    fs.writeFileSync(JsonPath, JSON.stringify(schema, null, 2), 'utf-8');
    console.log('yaml file is successfully transformed into json');
    const ts = await compile(schema, 'IComponentMaterial');
    fs.writeFileSync(tsPath, ts);
    console.log('schema.d.ts is successfully generated');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
