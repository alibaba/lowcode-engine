/// <reference types="node" />
import { EventEmitter } from 'events';
import { EditorConfig, LocaleType, PluginStatusSet, Utils, PluginClassSet, PluginSet } from './definitions';
declare global {
    interface Window {
        __isDebug?: boolean;
        __newFunc?: (funcStr: string) => (...args: any[]) => any;
    }
}
export interface HooksFuncs {
    [idx: number]: (msg: string, handler: (...args: any[]) => void) => void;
}
export default class Editor extends EventEmitter {
    static getInstance: (config: EditorConfig, components: PluginClassSet, utils?: Utils) => Editor;
    config: EditorConfig;
    components: PluginClassSet;
    utils: Utils;
    pluginStatus: PluginStatusSet;
    plugins: PluginSet;
    locale: LocaleType;
    private hooksFuncs;
    constructor(config: EditorConfig, components: PluginClassSet, utils?: Utils);
    init(): Promise<any>;
    destroy(): void;
    get(key: string): any;
    set(key: string | object, val: any): void;
    batchOn(events: string[], lisenter: (...args: any[]) => void): void;
    batchOnce(events: string[], lisenter: (...args: any[]) => void): void;
    batchOff(events: string[], lisenter: (...args: any[]) => void): void;
    private destroyHooks;
    private initHooks;
    private initPluginStatus;
}
