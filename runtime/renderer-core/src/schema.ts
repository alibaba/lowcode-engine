import type {
  ProjectSchema,
  RootSchema,
  ComponentMap,
  PageSchema,
} from '@alilc/runtime-shared';
import { throwRuntimeError } from './error';
import { set, get } from 'lodash-es';

type AppSchemaType = ProjectSchema<RootSchema>;

export interface AppSchema {
  getComponentsTrees(): RootSchema[];
  addComponentsTree(tree: RootSchema): void;
  removeComponentsTree(id: string): void;

  getComponentsMaps(): ComponentMap[];
  addComponentsMap(componentName: ComponentMap): void;
  removeComponentsMap(componentName: string): void;

  getPages(): PageSchema[];
  addPage(page: PageSchema): void;
  removePage(id: string): void;

  getByKey<K extends keyof AppSchemaType>(key: K): AppSchemaType[K] | undefined;
  updateByKey<K extends keyof AppSchemaType>(
    key: K,
    updater: AppSchemaType[K] | ((value: AppSchemaType[K]) => AppSchemaType[K])
  ): void;

  getByPath(path: string | string[]): any;
  updateByPath(
    path: string | string[],
    updater: any | ((value: any) => any)
  ): void;

  find(predicate: (schema: AppSchemaType) => any): any;
}

export function createAppSchema(schema: ProjectSchema): AppSchema {
  if (!schema.version.startsWith('1.')) {
    throwRuntimeError('core', 'schema version must be 1.x.x');
  }

  const schemaRef = structuredClone(schema);

  return {
    getComponentsTrees() {
      return schemaRef.componentsTree;
    },
    addComponentsTree(tree) {
      addArrayItem(schemaRef.componentsTree, tree, 'id');
    },
    removeComponentsTree(id) {
      removeArrayItem(schemaRef.componentsTree, 'id', id);
    },

    getComponentsMaps() {
      return schemaRef.componentsMap;
    },
    addComponentsMap(componentsMap) {
      addArrayItem(schemaRef.componentsMap, componentsMap, 'componentName');
    },
    removeComponentsMap(componentName) {
      removeArrayItem(schemaRef.componentsMap, 'componentName', componentName);
    },

    getPages() {
      return schemaRef.pages ?? [];
    },
    addPage(page) {
      schemaRef.pages ??= [];
      addArrayItem(schemaRef.pages, page, 'id');
    },
    removePage(id) {
      schemaRef.pages ??= [];
      removeArrayItem(schemaRef.pages, 'id', id);
    },

    getByKey(key) {
      return schemaRef[key];
    },
    updateByKey(key, updater) {
      const value = schemaRef[key];

      schemaRef[key] = typeof updater === 'function' ? updater(value) : updater;
    },

    find(predicate) {
      return predicate(schemaRef);
    },
    getByPath(path) {
      return get(schemaRef, path);
    },
    updateByPath(path, updater) {
      set(
        schemaRef,
        path,
        typeof updater === 'function' ? updater(this.getByPath(path)) : updater
      );
    },
  };
}

function addArrayItem<T extends Record<string, any>>(
  target: T[],
  item: T,
  comparison: string
) {
  const idx = target.findIndex(_ => _[comparison] === item[comparison]);
  if (idx > -1) {
    target.splice(idx, 1, item);
  } else {
    target.push(item);
  }
}

function removeArrayItem<T extends Record<string, any>>(
  target: T[],
  comparison: string,
  comparisonValue: any
) {
  const idx = target.findIndex(item => item[comparison] === comparisonValue);
  if (idx > -1) target.splice(idx, 1);
}
