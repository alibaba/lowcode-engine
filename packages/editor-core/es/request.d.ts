import 'whatwg-fetch';
export declare function serialize(obj: object): string;
export declare function buildUrl(dataAPI: string, params: object): string;
export declare function get(dataAPI: string, params?: object, headers?: object, otherProps?: object): Promise<any>;
export declare function post(dataAPI: string, params?: object, headers?: object, otherProps?: object): Promise<any>;
export declare function request(dataAPI: string, method?: string, data?: object | string, headers?: object, otherProps?: object): Promise<any>;
