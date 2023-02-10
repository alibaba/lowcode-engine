
export type IPublicTypeEditorGetResult<T, ClsType> = T extends undefined ? ClsType extends {
  prototype: infer R;
} ? R : any : T;
