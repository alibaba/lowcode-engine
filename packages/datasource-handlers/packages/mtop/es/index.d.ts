import { RuntimeOptionsConfig } from '@ali/build-success-types';
export declare type Method = 'get' | 'post' | 'GET' | 'POST';
export declare type DataType = 'jsonp' | 'json' | 'originaljsonp';
export declare function createMtopHandler<T = unknown>(config?: MTopConfig): (options: RuntimeOptionsConfig) => Promise<{
    data: T;
}>;
