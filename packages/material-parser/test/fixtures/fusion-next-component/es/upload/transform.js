import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
// compatible with 0.x version
/* istanbul ignore next */
var transform = function transform(props, deprecated) {
    var listType = props.listType,
        defaultFileList = props.defaultFileList,
        fileList = props.fileList,
        others = _objectWithoutProperties(props, ['listType', 'defaultFileList', 'fileList']);

    var newprops = others;

    if (listType === 'text-image') {
        deprecated('listType=text-image', 'listType=image', 'Upload');
        newprops.listType = 'image';
    } else if (listType === 'picture-card') {
        deprecated('listType=picture-card', 'listType=card', 'Upload');
        newprops.listType = 'card';
    } else {
        newprops.listType = listType;
    }

    if ('defaultFileList' in props) {
        deprecated('defaultFileList', 'defaultValue', 'Upload');
        newprops.defaultValue = defaultFileList;
    }

    if ('fileList' in props) {
        deprecated('fileList', 'value', 'Upload');
        newprops.value = fileList;
    }

    return newprops;
};

export default transform;