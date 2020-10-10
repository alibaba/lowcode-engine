var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mtopRequest from '@ali/universal-mtop';
// 考虑一下 mtop 类型的问题，官方没有提供 ts 文件
export function createMtopHandler(config) {
    if (config && Object.keys(config).length > 0) {
        Object.keys(config).forEach((key) => mtopRequest.config(key, config[key]));
    }
    return function (options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield mtopRequest.request({
                    api: options.uri,
                    v: options.v || '1.0',
                    data: options.params,
                    type: options.method || 'get',
                    dataType: options.dataType || 'json',
                    timeout: options.timeout,
                    headers: options.headers,
                });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    };
}
