export { _off as off };
/**
 * 取消事件绑定
 * @param  {*}   node       DOM节点或任何可以绑定事件的对象
 * @param  {String}   eventName  事件名
 * @param  {Function} callback   回调方法
 * @param  {Boolean}   [useCapture=false] 是否开启事件捕获优先
 */
function _off(node, eventName, callback, useCapture) {
    /* istanbul ignore else */
    if (node.removeEventListener) {
        node.removeEventListener(eventName, callback, useCapture || false);
    }
}

/**
 * 绑定事件
 * @param  {*}   node       DOM节点或任何可以绑定事件的对象
 * @param  {String}   eventName  事件名
 * @param  {Function} callback   回调方法
 * @param  {Boolean}   useCapture 是否开启事件捕获优先
 * @return {Object}               返回的object中包含一个off方法，用于取消事件监听
 *
 * @example
 * const handler = events.on(document.body, 'click', e => {
 *     // handle click ...
 * });
 * // 取消事件绑定
 * handler.off();
 */
export function on(node, eventName, callback, useCapture) {
    /* istanbul ignore else */
    if (node.addEventListener) {
        node.addEventListener(eventName, callback, useCapture || false);
    }

    return {
        off: function off() {
            return _off(node, eventName, callback, useCapture);
        }
    };
}

/**
 * 绑定事件，只执行一次后销毁
 * @param  {*}   node       DOM节点或任何可以绑定事件的对象
 * @param  {String}   eventName  事件名
 * @param  {Function} callback   回调方法
 * @param  {Boolean}   useCapture 是否开启事件捕获优先
 * @return {Function}             返回的object中包含一个off方法，用于取消事件监听
 */
export function once(node, eventName, callback, useCapture) {
    return on(node, eventName, function __fn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        callback.apply(this, args);

        // 由于addEventListener中的参数options只在Chrome 55、Firefox(Gecko)以上版本支持，故还是用传统的方法实现once
        _off(node, eventName, __fn, useCapture);
    }, useCapture);
}