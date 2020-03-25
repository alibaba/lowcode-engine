/// <reference types="react" />
import Editor from './editor';
import { EditorConfig, I18nFunction, I18nMessages, LocaleType, ShortCutsConfig } from './definitions';
export declare const pick: any;
export declare const deepEqual: any;
export declare const clone: any;
export declare const isEmpty: any;
export declare const throttle: any;
export declare const debounce: any;
export declare const serialize: any;
declare global {
    interface Window {
        sendIDEMessage?: (params: IDEMessageParams) => void;
        goldlog?: {
            record: (logKey: string, gmKey: string, goKey: string, method: 'POST' | 'GET') => (...args: any[]) => any;
        };
        is_theia?: boolean;
        vscode?: boolean;
    }
}
export interface IDEMessageParams {
    action: string;
    data: {
        logKey: string;
        gmKey: string;
        goKey: string;
    };
}
export declare function generateI18n(locale?: LocaleType, messages?: I18nMessages): I18nFunction;
/**
 * 序列化参数
 */
export declare function serializeParams(obj: object): string;
/**
 * 黄金令箭埋点
 * @param {String} gmKey 为黄金令箭业务类型
 * @param {Object} params 参数
 * @param {String} logKey 属性串
 */
export declare function goldlog(gmKey: string, params?: object, logKey?: string): void;
/**
 * 获取当前编辑器环境
 */
export declare function getEnv(): string;
export declare function registShortCuts(config: ShortCutsConfig, editor: Editor): void;
export declare function unRegistShortCuts(config: ShortCutsConfig): void;
/**
 * 将函数返回结果转成promise形式，如果函数有返回值则根据返回值的bool类型判断是reject还是resolve，若函数无返回值默认执行resolve
 */
export declare function transformToPromise(input: any): Promise<{}>;
/**
 * 将数组类型转换为Map类型
 */
interface MapOf<T> {
    [propName: string]: T;
}
export declare function transformArrayToMap<T>(arr: T[], key: string, overwrite?: boolean): MapOf<T>;
/**
 * 解析url的查询参数
 */
interface Query {
    [propName: string]: string;
}
export declare function parseSearch(search: string): Query;
export declare function comboEditorConfig(defaultConfig: EditorConfig, customConfig: EditorConfig): EditorConfig;
/**
 * 判断当前组件是否能够设置ref
 * @param {*} Comp 需要判断的组件
 */
export declare function acceptsRef(Comp: React.ReactNode): boolean;
export {};
