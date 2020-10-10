var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'universal-request';
// config 留着扩展
export function createFetchHandler(config) {
    return function (options) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestConfig = Object.assign(Object.assign({}, options), { url: options.uri, method: options.method, data: options.params, headers: options.headers });
            try {
                const response = yield request(requestConfig);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    };
}
