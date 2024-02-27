/**
 * Element names may consist of Latin letters, digits, dashes and underscores.
 * CSS class is formed as block name plus two underscores plus element name: .block__elem
 * @param block
 * @param element
 */
function getBEMElement(block: string, element: string) {
    return `${block}__${element}`;
}

/**
 * CSS class is formed as block’s or element’s name plus two dashes:
 * .block--mod or .block__elem--mod and .block--color-black with .block--color-red.
 * Spaces in complicated modifiers are replaced by dash.
 * @param blockOrElement
 * @param modifier
 */
function getBEMModifier(blockOrElement: string, modifier: string) {
    return `${blockOrElement}--${modifier}`;
}

export const splitClassName = 'react-split';
export const splitDragClassName = getBEMModifier(splitClassName, 'dragging');
export const splitVerticalClassName = getBEMModifier(splitClassName, 'vertical');
export const splitHorizontalClassName = getBEMModifier(splitClassName, 'horizontal');

export const bodyDisableUserSelect = getBEMModifier(splitClassName, 'disabled');
export const paneClassName = getBEMElement(splitClassName, 'pane');
export const sashClassName = getBEMElement(splitClassName, 'sash');

export const sashVerticalClassName = getBEMModifier(
    sashClassName,
    'vertical'
);
export const sashHorizontalClassName = getBEMModifier(
    sashClassName,
    'horizontal'
);
export const sashDisabledClassName = getBEMModifier(
    sashClassName,
    'disabled'
);
export const sashHoverClassName = getBEMModifier(sashClassName, 'hover');

export function classNames(...args) {
    const classList: string[] = [];
    for (const arg of args) {
        if (!arg) continue;
        const argType = typeof arg;
        if (argType === 'string' || argType === 'number') {
            classList.push(`${arg}`);
            continue;
        }
        if (argType === 'object') {
            if (arg.toString !== Object.prototype.toString) {
                classList.push(arg.toString());
                continue;
            }
            for (const key in arg) {
                if (Object.hasOwnProperty.call(arg, key) && arg[key]) {
                    classList.push(key);
                }
            }
        }
    }
    return classList.join(' ');
}

/**
 * Convert size to absolute number or Infinity
 * SplitPane allows sizes in string and number, but the state sizes only support number,
 * so convert string and number to number in here
 * 'auto' -> divide the remaining space equally
 * 'xxxpx' -> xxx
 * 'xxx%' -> wrapper.size * xxx/100
 *  xxx -> xxx
 */
export function assertsSize (
    size: string | number | undefined,
    sum: number,
    defaultValue = Infinity
) {
    if (typeof size === 'undefined') return defaultValue;
    if (typeof size === 'number') return size;
    if (size.endsWith('%')) return sum * (+size.replace('%', '') / 100);
    if (size.endsWith('px')) return +size.replace('px', '');
    return defaultValue;
}
