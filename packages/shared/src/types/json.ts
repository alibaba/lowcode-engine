export type JSONValue = number | string | boolean | null;

export interface JSONObject {
  [key: string]: JSONValue | JSONObject | JSONObject[];
}

export type JSONSchemaType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

/**
 * fork from vscode
 */
export interface IJSONSchema {
  id?: string;
  $id?: string;
  $schema?: string;
  type?: JSONSchemaType | JSONSchemaType[];
  title?: string;
  default?: any;
  definitions?: IJSONSchemaMap;
  description?: string;
  properties?: IJSONSchemaMap;
  patternProperties?: IJSONSchemaMap;
  additionalProperties?: boolean | IJSONSchema;
  minProperties?: number;
  maxProperties?: number;
  dependencies?: IJSONSchemaMap | { [prop: string]: string[] };
  items?: IJSONSchema | IJSONSchema[];
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  additionalItems?: boolean | IJSONSchema;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean | number;
  exclusiveMaximum?: boolean | number;
  multipleOf?: number;
  required?: string[];
  $ref?: string;
  anyOf?: IJSONSchema[];
  allOf?: IJSONSchema[];
  oneOf?: IJSONSchema[];
  not?: IJSONSchema;
  enum?: any[];
  format?: string;

  // schema draft 06
  const?: any;
  contains?: IJSONSchema;
  propertyNames?: IJSONSchema;
  examples?: any[];

  // schema draft 07
  $comment?: string;
  if?: IJSONSchema;
  then?: IJSONSchema;
  else?: IJSONSchema;

  // schema 2019-09
  unevaluatedProperties?: boolean | IJSONSchema;
  unevaluatedItems?: boolean | IJSONSchema;
  minContains?: number;
  maxContains?: number;
  deprecated?: boolean;
  dependentRequired?: { [prop: string]: string[] };
  dependentSchemas?: IJSONSchemaMap;
  $defs?: { [name: string]: IJSONSchema };
  $anchor?: string;
  $recursiveRef?: string;
  $recursiveAnchor?: string;
  $vocabulary?: any;

  // schema 2020-12
  prefixItems?: IJSONSchema[];
  $dynamicRef?: string;
  $dynamicAnchor?: string;

  // internal extensions
  errorMessage?: string;
}

export interface IJSONSchemaMap {
  [name: string]: IJSONSchema;
}
