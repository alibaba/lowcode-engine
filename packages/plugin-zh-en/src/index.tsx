import { PureComponent } from 'react';
import { globalLocale, Tip } from '@ali/lowcode-editor-core';
import { PluginProps } from '@ali/lowcode-types';
import { intl } from './locale';
import { IconZh } from './icons/zh';
import { IconEn } from './icons/en';
import './index.less';

export default class ZhEn extends PureComponent<PluginProps> {
  static displayName = 'LowcodeZhEn';

  state = {
    locale: globalLocale.getLocale(),
  };

  private dispose = globalLocale.onLocaleChange((locale) => {
    this.setState({
      locale,
    });
  });

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const isZh = this.state.locale === 'zh-CN';
    return (
      <div
        className="lowcode-plugin-zh-en"
        onClick={() => {
          globalLocale.setLocale(isZh ? 'en-US' : 'zh-CN');
        }}
      >
        {isZh ? <IconZh size={20} /> : <IconEn size={20} />}
        <Tip direction="right">{intl('To Locale')}</Tip>
      </div>
    );
  }
}
