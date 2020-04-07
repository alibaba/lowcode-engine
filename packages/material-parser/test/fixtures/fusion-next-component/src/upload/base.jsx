import { Component } from 'react';

export default class Base extends Component {
    /* istanbul ignore next */
    abort(file) {
        /* istanbul ignore next */
        this.uploaderRef.abort(file);
    }
    /* istanbul ignore next */
    startUpload() {
        /* istanbul ignore next */
        this.uploaderRef.startUpload();
    }

    saveUploaderRef = ref => {
        /* istanbul ignore if */
        if (ref && typeof ref.getInstance === 'function') {
            this.uploaderRef = ref.getInstance();
        } else {
            this.uploaderRef = ref;
        }
    };

    /* istanbul ignore next */
    isUploading() {
        /* istanbul ignore next */
        return this.uploaderRef.isUploading();
    }
}
