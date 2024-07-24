import { type StringDictionary } from '@alilc/lowcode-shared';
import { uniq } from 'lodash-es';

export interface IInspectValue<T> {
  readonly value?: T;
  readonly override?: T;
  readonly overrides?: { readonly identifiers: string[]; readonly value: T }[];
}

export function toValuesTree(properties: StringDictionary): any {
  const root = Object.create(null);

  for (const key of Object.keys(properties)) {
    addToValueTree(root, key, properties[key]);
  }

  return root;
}

export function addToValueTree(
  settingsTreeRoot: any,
  key: string,
  value: any,
  conflictReporter: (message: string) => void = console.error,
): void {
  const segments = key.split('.');
  const last = segments.pop()!;

  let curr = settingsTreeRoot;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    let obj = curr[s];
    switch (typeof obj) {
      case 'undefined':
        obj = curr[s] = Object.create(null);
        break;
      case 'object':
        if (obj === null) {
          conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is null`);
          return;
        }
        break;
      default:
        conflictReporter(
          `Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is ${JSON.stringify(obj)}`,
        );
        return;
    }
    curr = obj;
  }

  if (typeof curr === 'object' && curr !== null) {
    try {
      curr[last] = value; // workaround https://github.com/microsoft/vscode/issues/13606
    } catch (e) {
      conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
    }
  } else {
    conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
  }
}

export function removeFromValueTree(valueTree: any, key: string): void {
  const segments = key.split('.');
  doRemoveFromValueTree(valueTree, segments);
}

function doRemoveFromValueTree(valueTree: any, segments: string[]): void {
  const first = segments.shift()!;
  if (segments.length === 0) {
    // Reached last segment
    delete valueTree[first];
    return;
  }

  if (Object.keys(valueTree).includes(first)) {
    const value = valueTree[first];
    if (typeof value === 'object' && !Array.isArray(value)) {
      doRemoveFromValueTree(value, segments);
      if (Object.keys(value).length === 0) {
        delete valueTree[first];
      }
    }
  }
}

const OVERRIDE_IDENTIFIER_PATTERN = `\\[([^\\]]+)\\]`;
const OVERRIDE_IDENTIFIER_REGEX = new RegExp(OVERRIDE_IDENTIFIER_PATTERN, 'g');
export const OVERRIDE_PROPERTY_PATTERN = `^(${OVERRIDE_IDENTIFIER_PATTERN})+$`;
export const OVERRIDE_PROPERTY_REGEX = new RegExp(OVERRIDE_PROPERTY_PATTERN);

export function overrideIdentifiersFromKey(key: string): string[] {
  const identifiers: string[] = [];
  if (OVERRIDE_PROPERTY_REGEX.test(key)) {
    let matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
    while (matches?.length) {
      const identifier = matches[1].trim();
      if (identifier) {
        identifiers.push(identifier);
      }
      matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
    }
  }
  return uniq(identifiers);
}
