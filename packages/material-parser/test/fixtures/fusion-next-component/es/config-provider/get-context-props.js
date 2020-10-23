import _extends from 'babel-runtime/helpers/extends';
import zhCN from '../locale/zh-cn.js';
import { obj } from '../util';
/**
 *
 * @param {Object|Boolean} input
 * @returns {Object} typeof obj.open === 'boolean'
 */
var parseBoundary = function parseBoundary(input) {
    var obj = void 0;
    if (input === undefined || input === null) {
        return {};
    } else if (typeof input === 'boolean') {
        obj = { open: input };
    } else {
        obj = _extends({ open: true }, input);
    }

    return obj;
};

export default function getContextProps(props, context, displayName) {
    var prefix = props.prefix,
        locale = props.locale,
        pure = props.pure,
        rtl = props.rtl,
        device = props.device,
        popupContainer = props.popupContainer,
        errorBoundary = props.errorBoundary;
    var nextPrefix = context.nextPrefix,
        nextLocale = context.nextLocale,
        nextPure = context.nextPure,
        nextWarning = context.nextWarning,
        nextRtl = context.nextRtl,
        nextDevice = context.nextDevice,
        nextPopupContainer = context.nextPopupContainer,
        nextErrorBoundary = context.nextErrorBoundary;


    var newPrefix = prefix || nextPrefix;

    var localeFromContext = void 0;
    if (nextLocale) {
        localeFromContext = nextLocale[displayName];
        if (localeFromContext) {
            localeFromContext.momentLocale = nextLocale.momentLocale;
        }
    }

    var newLocale = void 0;
    if (locale) {
        newLocale = obj.deepMerge({}, zhCN[displayName], localeFromContext, locale);
    } else if (localeFromContext) {
        newLocale = obj.deepMerge({}, zhCN[displayName], localeFromContext);
    }

    var newPure = typeof pure === 'boolean' ? pure : nextPure;
    var newRtl = typeof rtl === 'boolean' ? rtl : nextRtl;

    // ProtoType of [nextE|e]rrorBoundary can be one of [boolean, object]
    // but typeof newErrorBoundary === 'object'
    // newErrorBoundary should always have the key 'open', which indicates ErrorBoundary on or off
    var newErrorBoundary = _extends({}, parseBoundary(nextErrorBoundary), parseBoundary(errorBoundary));

    if (!('open' in newErrorBoundary)) {
        newErrorBoundary.open = false;
    }

    return {
        prefix: newPrefix,
        locale: newLocale,
        pure: newPure,
        rtl: newRtl,
        warning: nextWarning,
        device: device || nextDevice || undefined,
        popupContainer: popupContainer || nextPopupContainer,
        errorBoundary: newErrorBoundary
    };
}