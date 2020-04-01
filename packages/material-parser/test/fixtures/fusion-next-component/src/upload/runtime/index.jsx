import React from 'react';
import Html5Uploader from './html5-uploader';
import IframeUploader from './iframe-uploader';

export default class Uploader extends React.Component {
    state = {
        Component: Html5Uploader,
    };

    componentDidMount() {
        if (typeof File === 'undefined') {
            /* eslint react/no-did-mount-set-state:0 */
            this.setState({
                Component: IframeUploader,
            });
        }
    }

    abort(file) {
        this.uploaderRef.abort(file);
    }

    startUpload(files) {
        this.uploaderRef.startUpload(files);
    }

    saveUploaderRef = ref => {
        this.uploaderRef = ref;
    };

    render() {
        const Uploader = this.state.Component;
        return <Uploader {...this.props} ref={this.saveUploaderRef} />;
    }
}
