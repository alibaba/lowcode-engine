/**
 * IE浏览器的渲染引擎版本号
 * 注意：此属性与浏览器版本号不同，IE的渲染引擎版本号是可以通过HTML header或手动设置去更改的
 * @type {Number} 6 ~ 10
 */
export const ieVersion =
    typeof document !== 'undefined' ? document.documentMode : undefined;

/**
 * 判断是否是生产环境
 * @type {Boolean}
 */
export const isProduction = () => {
    const PRODUCTION_ENV = 'production';
    let result = false;
    try {
        if (process.env.NODE_ENV === PRODUCTION_ENV) {
            result = true;
        }
    } catch (err) {
        //
    }

    if (!result) {
        try {
            if (window.process.env.NODE_ENV === PRODUCTION_ENV) {
                result = true;
            }
        } catch (err) {
            //
        }
    }

    return result;
};

export default {
    ieVersion,
    isProduction,
};
