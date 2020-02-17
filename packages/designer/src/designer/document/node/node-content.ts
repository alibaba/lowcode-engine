import { obx } from '@recore/obx';
import { JSExpression, isJSExpression } from '../../schema';

export default class NodeContent {
  @obx.ref private _value: string | JSExpression = '';

  get value(): string | JSExpression {
    return this._value;
  }

  set value(val: string | JSExpression) {
    this._value = val;
  }

  /**
   * 获得表达式值
   */
  get code() {
    if (isJSExpression(this._value)) {
      return this._value.value;
    }
    return JSON.stringify(this.value);
  }

  /**
   * 设置表达式值
   */
  set code(code: string) {
    if (isJSExpression(this._value)) {
      this._value = {
        ...this._value,
        value: code,
      };
    } else {
      let useCode: boolean = true;
      try {
        const v = JSON.parse(code);
        const t = typeof v;
        if (v == null) {
          this._value = '';
          useCode = false;
        } else if (t === 'string' || t === 'number' || t === 'boolean') {
          this._value = String(v);
          useCode = false;
        }
      } catch (e) {
        // ignore
      }
      if (useCode) {
        this._value = {
          type: 'JSExpression',
          value: code,
          mock: this._value,
        };
      }
    }
  }

  constructor(value: any) {
    const type = typeof value;
    if (value == null) {
      this._value = '';
    } else if (type === 'string' || type === 'number' || type === 'boolean') {
      this._value = String(value);
    } else if (isJSExpression(value)) {
      this._value = value;
    }
  }

  /**
   * 是否表达式
   */
  isJSExpression(): boolean {
    return isJSExpression(this._value);
  }

  /**
   * 是否空值
   */
  isEmpty() {
    if (isJSExpression(this._value)) {
      return this._value.value === '';
    }
    return this._value === '';
  }
}
