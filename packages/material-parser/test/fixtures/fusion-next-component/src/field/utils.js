import { isValidElement, cloneElement } from 'react';
import ReactDOM from 'react-dom';

export function cloneAndAddKey(element) {
    if (element && isValidElement(element)) {
        const key = element.key || 'error';
        return cloneElement(element, { key });
    }
    return element;
}

export function scrollToFirstError({ errorsGroup, options, instance }) {
    if (errorsGroup && options.scrollToFirstError) {
        let firstNode;
        let firstTop;
        for (const i in errorsGroup) {
            if (errorsGroup.hasOwnProperty(i)) {
                const node = ReactDOM.findDOMNode(instance[i]);
                if (!node) {
                    return;
                }
                const top = node.offsetTop;
                if (firstTop === undefined || firstTop > top) {
                    firstTop = top;
                    firstNode = node;
                }
            }
        }

        if (firstNode) {
            if (
                typeof options.scrollToFirstError === 'number' &&
                window &&
                typeof window.scrollTo === 'function'
            ) {
                const offsetLeft =
                    document && document.body && document.body.offsetLeft
                        ? document.body.offsetLeft
                        : 0;
                window.scrollTo(
                    offsetLeft,
                    firstTop + options.scrollToFirstError
                );
            } else if (firstNode.scrollIntoViewIfNeeded) {
                firstNode.scrollIntoViewIfNeeded(true);
            }
        }
    }
}
