import { type StringDictionary, type ComponentTree } from '@alilc/lowcode-shared';
import { CodeRuntime } from '@alilc/lowcode-renderer-core';
import { FunctionComponent, ComponentType } from 'react';
import {
  type LowCodeComponentProps,
  createComponent as createSchemaComponent,
  type ComponentOptions as SchemaComponentOptions,
  reactiveStateFactory,
} from '../runtime';
import { type ComponentsAccessor } from '../app';

export interface ComponentOptions extends SchemaComponentOptions {
  schema: ComponentTree;
  componentsRecord: Record<string, ComponentType>;
  codeScope?: StringDictionary;
}

export function createComponent(
  options: ComponentOptions,
): FunctionComponent<LowCodeComponentProps> {
  const { schema, componentsRecord, modelOptions, codeScope, ...componentOptions } = options;
  const codeRuntime = new CodeRuntime(codeScope);
  const components: ComponentsAccessor = {
    getComponent(componentName) {
      return componentsRecord[componentName] as any;
    },
  };

  const LowCodeComponent = createSchemaComponent(schema, codeRuntime, components, {
    ...componentOptions,
    modelOptions: {
      ...modelOptions,
      stateCreator: modelOptions.stateCreator ?? reactiveStateFactory,
    },
  });

  return LowCodeComponent;
}
