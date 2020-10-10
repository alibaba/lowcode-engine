import { MopenClientConfig } from '@ali/mirror-io-client-mopen';
import { RuntimeOptionsConfig } from '@ali/build-success-types';
export declare function createMopenHandler<T = unknown>(config?: MopenClientConfig): (options: RuntimeOptionsConfig) => Promise<{
    data: T;
}>;
