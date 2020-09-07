import { isValidElement, cloneElement } from 'react';
import ReactDOM from 'react-dom';

export function cloneAndAddKey(element) {
    if (element && isValidElement(element)) {
        var key = element.key || 'error';
        return cloneElement(element, { key: key });
    }
    return element;
}

export function scrollToFirstError(_ref) {
    var errorsGroup = _ref.errorsGroup,
        options = _ref.options,
        instance = _ref.instance;

    if (errorsGroup && options.scrollToFirstError) {
        var firstNode = void 0;
        var firstTop = void 0;
        for (var i in errorsGroup) {
            if (errorsGroup.hasOwnProperty(i)) {
                var node = ReactDOM.findDOMNode(instance[i]);
                if (!node) {
                    return;
                }
                var top = node.offsetTop;
                if (firstTop === undefined || firstTop > top) {
                    firstTop = top;
                    firstNode = node;
                }
            }
        }

        if (firstNode) {
            if (typeof options.scrollToFirstError === 'number' && window && typeof window.scrollTo === 'function') {
                var offsetLeft = document && document.body && document.body.offsetLeft ? document.body.offsetLeft : 0;
                window.scrollTo(offsetLeft, firstTop + options.scrollToFirstError);
            } else if (firstNode.scrollIntoViewIfNeeded) {
                firstNode.scrollIntoViewIfNeeded(true);
            }
        }
    }
}