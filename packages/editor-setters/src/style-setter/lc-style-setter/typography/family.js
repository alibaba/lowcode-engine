import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import SelectControl from '@ali/ve-select-control';
import utils from '../utils';
import $i18n from '../i18n/index';

const fonts = [
  {
    text: $i18n.get({ id: 'styleArialHelveticaMicrosoftYahei', dm: 'Arial, Helvetica, 微软雅黑' }),
    value: 'arial, helvetica, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleArialHelveticaBlackBody', dm: 'Arial, Helvetica, 黑体' }),
    value: 'arial, helvetica, simhei',
  },
  {
    text: $i18n.get({ id: 'styleComicSansMSMicrosoft', dm: 'Comic Sans MS, 微软雅黑' }),
    value: 'comic sans ms, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleComicSansMSBlackbody', dm: 'Comic Sans MS, 黑体' }),
    value: 'comic sans ms, simhei',
  },
  {
    text: $i18n.get({ id: 'styleImpactMicrosoftYahei', dm: 'Impact, 微软雅黑' }),
    value: 'impact, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleImpactBlackBody', dm: 'Impact, 黑体' }),
    value: 'impact, simhei',
  },
  {
    text: $i18n.get({ id: 'styleLucidaSansUnicodeMicrosoft', dm: 'Lucida Sans Unicode, 微软雅黑' }),
    value: 'lucida sans unicode, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleLucidaSansUnicodeBlackbody', dm: 'Lucida Sans Unicode, 黑体' }),
    value: 'lucida sans unicode, simhei',
  },
  {
    text: $i18n.get({ id: 'styleTrebuchetMSMicrosoftYahei', dm: 'Trebuchet MS, 微软雅黑' }),
    value: 'trebuchet ms, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleTrebuchetMSBlackBody', dm: 'Trebuchet MS, 黑体' }),
    value: 'trebuchet ms, simhei',
  },
  {
    text: $i18n.get({ id: 'styleVerdanaMicrosoftYahei', dm: 'Verdana, 微软雅黑' }),
    value: 'verdana, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleVerdanaBlackBody', dm: 'Verdana, 黑体' }),
    value: 'verdana, simhei',
  },
  {
    text: $i18n.get({ id: 'styleGeorgiaMicrosoftYahei', dm: 'Georgia, 微软雅黑' }),
    value: 'georgia, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleGeorgiaBlackbody', dm: 'Georgia, 黑体' }),
    value: 'georgia, simhei',
  },
  {
    text: $i18n.get({
      id: 'stylePalatinoLinotypeMicrosoftYahei',
      dm: 'Palatino Linotype, 微软雅黑',
    }),
    value: 'palatino linotype, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'stylePalatinoLinotypeBlackBody', dm: 'Palatino Linotype, 黑体' }),
    value: 'palatino linotype, simhei',
  },
  {
    text: $i18n.get({ id: 'styleTimesNewRomanMicrosoft', dm: 'Times New Roman, 微软雅黑' }),
    value: 'times new roman, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleTimesNewRomanBlackbody', dm: 'Times New Roman, 黑体' }),
    value: 'times new roman, simhei',
  },
  {
    text: $i18n.get({ id: 'styleCourierNewMicrosoftYahei', dm: 'Courier New, 微软雅黑' }),
    value: 'courier new, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleCourierNewBlackbody', dm: 'Courier New, 黑体' }),
    value: 'courier new, simhei',
  },
  {
    text: $i18n.get({ id: 'styleLucidaConsoleMicrosoftYahei', dm: 'Lucida Console, 微软雅黑' }),
    value: 'lucida console, microsoft yahei',
  },
  {
    text: $i18n.get({ id: 'styleLucidaConsoleBlackbody', dm: 'Lucida Console, 黑体' }),
    value: 'lucida console, simhei',
  },
];

class FamilyItem extends Component {
  static propTypes = {
    font: PropTypes.object,
  };

  render() {
    const { font } = this.props;
    return (
      <div
        className="vs-style-familyitem"
        style={{
          fontFamily: font.value,
        }}
      >
        {font.text}
      </div>
    );
  }
}

class Family extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleFontFamilySetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-font-family', this.props.className);
    const family = utils.getFont(this.props, 'font-family').value;
    const options = fonts.map(font => ({
      text: <FamilyItem key={font.value} font={font} />,
      value: font.value,
    }));

    return (
      <SelectControl
        className={className}
        options={options}
        value={family}
        onChange={val => utils.setFont(this.props, 'font-family', val)}
        syncTargetWidth
      />
    );
  }
}

export default Family;
