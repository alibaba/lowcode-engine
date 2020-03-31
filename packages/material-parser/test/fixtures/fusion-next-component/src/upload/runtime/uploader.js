import { func, obj } from '../../util';
import { uid, errorCode } from '../util';
import defaultRequest from './request';

const noop = func.noop;

export default class Uploader {
    constructor(options) {
        this.options = {
            beforeUpload: noop,
            onProgress: noop,
            onSuccess: noop,
            onError: noop,
            data: {},
            name: 'file',
            method: 'post',
            ...options,
        };
        this.reqs = {};
    }

    setOptions(options) {
        Object.assign(this.options, options);
    }

    startUpload(files) {
        const filesArr = files.length
            ? Array.prototype.slice.call(files)
            : [files];
        filesArr.forEach(file => {
            file.uid = file.uid || uid();
            this.upload(file);
        });
    }

    abort(file) {
        const { reqs } = this;
        if (file) {
            let uid = file;
            if (file && file.uid) {
                uid = file.uid;
            }
            if (reqs[uid]) {
                reqs[uid].abort();
                delete reqs[uid];
            }
        } else {
            Object.keys(reqs).forEach(uid => {
                if (reqs[uid]) {
                    reqs[uid].abort();
                }
                delete reqs[uid];
            });
        }
    }

    upload(file) {
        const {
            beforeUpload,
            action,
            name,
            headers,
            timeout,
            withCredentials,
            method,
            data,
        } = this.options;
        const before = beforeUpload(file, {
            action,
            name,
            headers,
            timeout,
            withCredentials,
            method,
            data,
        });

        func.promiseCall(
            before,
            options => {
                if (options === false) {
                    const err = new Error(errorCode.BEFOREUPLOAD_REJECT);
                    err.code = errorCode.BEFOREUPLOAD_REJECT;
                    return this.options.onError(err, null, file);
                }
                this.post(
                    file,
                    obj.isPlainObject(options) ? options : undefined
                );
            },
            error => {
                let err;
                if (error) {
                    err = error;
                } else {
                    err = new Error(errorCode.BEFOREUPLOAD_REJECT);
                    err.code = errorCode.BEFOREUPLOAD_REJECT;
                }
                this.options.onError(err, null, file);
            }
        );
    }

    post(file, options = {}) {
        const requestOptions = {
            ...this.options,
            ...options,
        };
        const {
            action,
            name,
            headers,
            timeout,
            withCredentials,
            onProgress,
            onSuccess,
            onError,
            method,
        } = requestOptions;

        let data = requestOptions.data;
        if (typeof data === 'function') {
            data = data(file);
        }

        const { uid } = file;

        const request =
            typeof requestOptions.request === 'function'
                ? requestOptions.request
                : defaultRequest;
        this.reqs[uid] = request({
            action,
            filename: name,
            file,
            data,
            timeout,
            headers,
            withCredentials,
            method,
            onProgress: e => {
                onProgress(e, file);
            },
            onSuccess: ret => {
                delete this.reqs[uid];
                onSuccess(ret, file);
            },
            onError: (err, ret) => {
                delete this.reqs[uid];
                onError(err, ret, file);
            },
        });
    }
}
