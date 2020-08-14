import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { useState, useMemo } from 'react';
import Field from '@alifd/field';

import { log } from '../util';
import { scrollToFirstError, cloneAndAddKey } from './utils';

var NextField = function (_Field) {
    _inherits(NextField, _Field);

    NextField.useField = function useField() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!useState || !useMemo) {
            log.warning('need react version > 16.8.0');
            return;
        }
        return this.getUseField({ useMemo: useMemo, useState: useState })(options);
    };

    function NextField(com) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, NextField);

        var newOptions = _extends({}, options, {
            afterValidateRerender: scrollToFirstError,
            processErrorMessage: cloneAndAddKey
        });

        var _this = _possibleConstructorReturn(this, _Field.call(this, com, newOptions));

        _this.validate = _this.validate.bind(_this);
        return _this;
    }

    NextField.prototype.validate = function validate(ns, cb) {
        this.validateCallback(ns, cb);
    };

    NextField.prototype.reset = function reset(ns) {
        var backToDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (ns === true) {
            log.deprecated('reset(true)', 'resetToDefault()', 'Field');
            this.resetToDefault();
        } else if (backToDefault === true) {
            log.deprecated('reset(ns,true)', 'resetToDefault(ns)', 'Field');
            this.resetToDefault(ns);
        } else {
            this._reset(ns, false);
        }
    };

    return NextField;
}(Field);

export default NextField;