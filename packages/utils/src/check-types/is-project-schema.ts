import { IPublicTypeProjectSchema } from "@alilc/lowcode-types";

export function isProjectSchema(data: any): data is IPublicTypeProjectSchema {
  return data && data.componentsTree;
}
