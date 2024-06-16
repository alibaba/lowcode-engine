import { describe, it, expect } from 'vitest';
import { walk } from '../../src/utils/node';

describe('sync walker', () => {
  it('down', () => {
    const ast = {
      hasMask: true,
      visible: false,
      footer: false,
      cancelProps: {
        text: false,
        type: 'normal',
      },
      confirmState: '确定',
      confirmStyle: 'primary',
      footerActions: 'cancel,ok',
      className: 'dialog_lkz6xvcv',
      confirmText: {
        en_US: 'Confirm',
        use: '',
        zh_CN: '确定',
        type: 'JSExpression',
        value: `({"en_US":"OK","key":"i18n-xgse6q6a","type":"i18n","zh_CN":"确定"})[this.utils.getLocale()]`,
        key: 'i18n-xgse6q6a',
        extType: 'i18n',
      },
      autoFocus: true,
      title: {
        mock: {
          en_US: 'Dialog Title',
          use: '',
          zh_CN: 'Dialog标题',
          type: 'JSExpression',
          value: `({"en_US":"Dialog Title","key":"i18n-0m3kaceq","type":"i18n","zh_CN":"Dialog标题"})[this.utils.getLocale()]`,
          key: 'i18n-0m3kaceq',
          extType: 'i18n',
        },
        type: 'JSExpression',
        value: 'state.dialogInfo && state.dialogInfo.title',
      },
      closeable: [
        'esc',
        'mask',
        {
          type: 'JSExpression',
          value: '1',
        },
      ],
      cancelText: {
        en_US: 'Cancel',
        use: '',
        zh_CN: '取消',
        type: 'JSExpression',
        value: `({"en_US":"Cancel","key":"i18n-wtq23279","type":"i18n","zh_CN":"取消"})[this.utils.getLocale()]`,
        key: 'i18n-wtq23279',
        extType: 'i18n',
      },
      width: '800px',
      footerAlign: 'right',
      popupOutDialog: true,
      __style__: ':root {}',
      fieldId: 'dialog_case',
      height: '500px',
    };

    const newAst = walk(ast, {
      enter(node, parent, key, index) {
        if (node.type === 'JSExpression') {
          this.replace({
            type: '1',
            value: '2',
          });
        }
      },
    });

    console.log(newAst, Object.is(newAst, ast));
  });
});
