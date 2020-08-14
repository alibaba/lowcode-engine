import _typeof from 'babel-runtime/helpers/typeof';
/**
 * Generate a string to be used for HTML id attributes
 *
 * @param {String} prefix - prefix text for the id. Important because without one, eventually there will be 2 elements with the same id on the same page
 * @param {Number} max - range for the random number generator. Defaults to 1,000,000, but can be set higher if necessary.
 * @returns {String}
 */
export function randomId(prefix) {
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000000;

    var rand = Math.ceil(Math.random() * max);

    return prefix ? escapeForId(prefix) + '-' + rand : rand.toString(10);
}

/**
 * Replace characters not allowed for HTML id attributes
 *
 * @param {String} text
 * @returns {String}
 */
export function escapeForId(text) {
    if (!text) {
        return '';
    }

    if ((typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object') {
        text = JSON.stringify(text);
    } else if (typeof text !== 'string') {
        text = String(text);
    }

    return text.replace(/['"]/gm, '').replace(/[\s'"]/gm, '-');
}