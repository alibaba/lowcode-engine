/**
 * clone from https://github.com/react-component/upload/blob/master/src/request.js
 */

function getError(option, xhr, msg) {
    msg = msg || 'cannot post ' + option.action + ' ' + xhr.status + '\'';
    var err = new Error(msg);
    err.status = xhr.status;
    err.method = option.method;
    err.url = option.action;
    return err;
}

function getBody(xhr) {
    var text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// option {
//  onProgress: (event: { percent: number }): void,
//  onError: (event: Error, body?: Object): void,
//  onSuccess: (body: Object): void,
//  data: Object,
//  filename: String,
//  file: File,
//  withCredentials: Boolean,
//  action: String,
//  headers: Object,
//  method: String
//  timeout: Number
// }
export default function upload(option) {
    var xhr = new XMLHttpRequest();

    if (option.onProgress && xhr.upload) {
        xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
                e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
        };
    }

    var formData = new FormData();

    if (option.data) {
        Object.keys(option.data).forEach(function (key) {
            formData.append(key, option.data[key]);
        });
    }

    formData.append(option.filename, option.file);

    xhr.onerror = function error(e) {
        option.onError(e);
    };

    xhr.onload = function onload() {
        // allow success when 2xx status
        // see https://github.com/react-component/upload/issues/34
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(option, xhr), getBody(xhr));
        }

        option.onSuccess(getBody(xhr), xhr);
    };

    option.method = option.method || 'POST';
    xhr.open(option.method, option.action, true);

    // In Internet Explorer, the timeout property may be set only after calling the open() method and before calling the send() method.
    // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
    var timeout = option.timeout;


    if (typeof timeout === 'number' && timeout > 0) {
        xhr.timeout = timeout;
        xhr.ontimeout = function () {
            var msg = 'Upload abort for exceeding time (timeout: ' + timeout + 'ms)';
            option.onError(getError(option, xhr, msg), getBody(xhr));
        };
    }

    // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    var headers = option.headers || {};

    // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33
    if (headers['X-Requested-With'] !== null) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    for (var h in headers) {
        if (headers.hasOwnProperty(h) && headers[h] !== null) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }
    xhr.send(formData);

    return {
        abort: function abort() {
            xhr.abort();
        }
    };
}