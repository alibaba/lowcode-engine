import Editor from './editor';
export { default as PluginFactory } from './plugin';
export { default as EditorContext } from './context';

import * as editorUtils from './utils';
import * as editorDefinitions from './definitions';
export default Editor;

export const utils = editorUtils;
export const definitions = editorDefinitions;
