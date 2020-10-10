var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UniversalMtopClient, } from '@ali/mirror-io-client-universal-mtop';
export function createMopenHandler(config) {
    return function (options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, response } = yield UniversalMtopClient.request(Object.assign(Object.assign({ config }, options), { api: options.uri, v: options.v, data: options.params, type: options.method || 'get', dataType: options.dataType || 'json', timeout: options.timeout, headers: options.headers }));
                return Object.assign(Object.assign({}, response), { data });
            }
            catch (error) {
                throw error;
            }
        });
    };
}
