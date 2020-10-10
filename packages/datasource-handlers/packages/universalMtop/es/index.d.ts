import { UniversalMtopClientConfig } from '@ali/mirror-io-client-universal-mtop';
import { RuntimeOptionsConfig } from '@ali/build-success-types';
export declare function createMopenHandler<T = unknown>(config?: UniversalMtopClientConfig): (options: RuntimeOptionsConfig) => Promise<{
    data: T;
}>;
