import { findDOMNode } from 'react-dom';

export default function findNode(target, param) {
    if (!target) {
        return null;
    }

    if (typeof target === 'string') {
        return document.getElementById(target);
    }

    if (typeof target === 'function') {
        try {
            target = target(param);
        } catch (err) {
            target = null;
        }
    }

    if (!target) {
        return null;
    }

    try {
        return findDOMNode(target);
    } catch (err) {
        return target;
    }
}
