import Ajv from 'ajv';
import schema from './schema.json';

const ajv = new Ajv({ jsonPointers: true });
const validate = ajv.compile(schema);

export default function validateSchema(json: object) {
  if (validate(json) === false) {
    throw new Error(JSON.stringify(validate.errors, null, 2));
  }

  return true;
}
