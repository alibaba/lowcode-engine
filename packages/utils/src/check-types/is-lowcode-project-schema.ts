import { IPublicTypeComponentSchema, IPublicTypeProjectSchema } from "@alilc/lowcode-types";
import { isComponentSchema } from "./is-component-schema";

export function isLowcodeProjectSchema(data: any): data is IPublicTypeProjectSchema<IPublicTypeComponentSchema> {
  return data && data.componentsTree && data.componentsTree.length && isComponentSchema(data.componentsTree[0]);
}
