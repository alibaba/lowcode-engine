import { IPublicModelSettingField } from "@alilc/lowcode-types";

export function isSettingField(obj: any): obj is IPublicModelSettingField {
  return obj && obj.isSettingField;
}
