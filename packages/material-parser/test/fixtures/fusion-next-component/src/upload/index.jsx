import React from 'react';
import ConfigProvider from '../config-provider';
import { log } from '../util';
import { errorCode } from './util';
import transform from './transform';
import Upload from './upload';
import List from './list';
import Card from './card';
import Dragger from './dragger';
import Selecter from './runtime/selecter';
import Uploader from './runtime/uploader';

Upload.Card = ConfigProvider.config(Card, { componentName: 'Upload' });
Upload.Dragger = ConfigProvider.config(Dragger, { componentName: 'Upload' });
Upload.Selecter = Selecter;
Upload.Uploader = Uploader;
Upload.ErrorCode = errorCode;

// compatible with 0.x version
Upload.ImageUpload = ConfigProvider.config(Card, {
    componentName: 'Upload',
    transform: /* istanbul ignore next */ (props, deprecated) => {
        deprecated('Upload.ImageUpload', 'Upload.Card', 'Upload');
        const newprops = transform(props, () => {});
        if (newprops.locale && newprops.locale.image) {
            newprops.locale.card = newprops.locale.image;
        }

        return newprops;
    },
});

// compatible with 0.x version
Upload.DragUpload = ConfigProvider.config(Dragger, {
    componentName: 'Upload',
    transform: /* istanbul ignore next */ (props, deprecated) => {
        deprecated('Upload.DragUpload', 'Upload.Dragger', 'Upload');
        const newprops = transform(props, () => {});
        if (!newprops.listType) {
            newprops.listType = 'card';
        }

        return newprops;
    },
});

// compatible with 0.x version
/* istanbul ignore next */
Upload.Core = class Core extends React.Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line
        const {
            action,
            name,
            method,
            beforeUpload,
            onProgress,
            onError,
            withCredentials,
            headers,
            data,
            onSuccess,
        } = this.props;

        this.uploader = new Uploader({
            action,
            name,
            method,
            beforeUpload,
            onProgress,
            onError,
            withCredentials,
            headers,
            data,
            onSuccess,
        });
    }

    abort() {
        this.uploader.abort();
    }

    handleSelect = files => {
        this.uploader.startUpload(files);
    };

    render() {
        log.deprecated(
            'Upload.Core',
            'Upload.Selecter and Upload.Uploader',
            'Upload'
        );

        // eslint-disable-next-line
        const {
            action,
            name,
            method,
            beforeUpload,
            onProgress,
            onError,
            withCredentials,
            headers,
            data,
            onSuccess,
            ...others
        } = this.props;

        const props = others;

        return (
            <Selecter
                {...transform(props, () => {})}
                onSelect={this.handleSelect}
            />
        );
    }
};

Upload.List = List;

// compatible with 0.x version
/* istanbul ignore next */
Upload.CropUpload = function() {
    log.deprecated('Upload.CropUpload', '@alife/bc-next-crop-upload', 'Upload');
    return null;
};

export default ConfigProvider.config(Upload, {
    transform,
});
