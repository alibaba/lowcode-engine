import Ajv from 'ajv';
import { Json } from '../types/Basic';
import schema from './schema.json';

const ajv = new Ajv({ jsonPointers: true });
const validate = ajv.compile(schema);

export default function validateSchema(json: Json) {
  if (validate(json) === false) {
    throw new Error(JSON.stringify(validate.errors, null, 2));
  }

  return true;
}
