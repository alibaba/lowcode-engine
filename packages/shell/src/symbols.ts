/**
 * 以下 symbol 均用于在 shell 层对外暴露的模型中存储相应内部模型的 key
 */
export const projectSymbol = Symbol('project');
export const designerSymbol = Symbol('designer');
export const skeletonSymbol = Symbol('skeleton');
export const documentSymbol = Symbol('document');
export const editorSymbol = Symbol('editor');
export const nodeSymbol = Symbol('node');
export const nodeChildrenSymbol = Symbol('nodeChildren');
export const propsSymbol = Symbol('props');
export const propSymbol = Symbol('prop');
export const detectingSymbol = Symbol('detecting');
export const selectionSymbol = Symbol('selection');
export const historySymbol = Symbol('history');
export const simulatorHostSymbol = Symbol('simulatorHost');
export const simulatorRendererSymbol = Symbol('simulatorRenderer');