export type JSONValueType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

export type JSONValue = number | string | boolean | null;

export interface JSONObject {
  [key: string]: JSONValue | JSONObject | JSONObject[];
}
