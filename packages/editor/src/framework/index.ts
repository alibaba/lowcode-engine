import Editor from './editor';

import * as editorUtils from './utils';
import * as editorDefinitions from './definitions';

export { default as PluginFactory } from './pluginFactory';
export { default as EditorContext } from './context';

export default Editor;

export const utils = editorUtils;
export const definitions = editorDefinitions;
