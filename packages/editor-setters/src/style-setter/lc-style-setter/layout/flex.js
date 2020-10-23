import React, { Component, PropTypes } from 'react';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import Field from '@ali/ve-field';
import utils from '../utils';
class Flex extends Component {
  static propTypes = {
    prop: PropTypes.object,
  };

  static displayName = 'StyleLayoutFlexSetter';

  render() {
    // flex-direction
    const direction = utils.getPropertyValue(this.props, 'flex-direction').value;
    // align-items
    const align = utils.getPropertyValue(this.props, 'align-items').value;
    // justify-content
    const justify = utils.getPropertyValue(this.props, 'justify-content').value;
    /*
    // flex-warp
    const wrap = getPropertyValue(this.props, 'flex-wrap').value;
    const isWrap = /^wrap/.test(wrap);
    // align-content
    const alignColumns = getPropertyValue(this.props, 'align-content').value;
    */

    const isVertical = /^column/.test(direction);
    const v = isVertical ? '-v' : '';
    const reverseClass = /reverse$/.test(direction)
      ? `vs-style-reverse${isVertical ? '-v' : '-h'}` : null;

    return (
      <div className="vs-style-layout-flex">
        <ChoiceControl
          className="vs-style-flex-property"
          value={direction}
          options={[{
            title: <Icons name="style.direction-row" size="medium" />,
            tip: 'Direction:row',
            value: 'row',
          }, {
            title: <Icons name="style.direction-column" size="medium" />,
            tip: 'Direction:column',
            value: 'column',
          }, {
            title: <Icons name="style.direction-row" className="vs-style-reverse-h" size="medium" />,
            tip: 'Direction:row-reverse',
            value: 'row-reverse',
          }, {
            title: (<Icons
              name="style.direction-column" className="vs-style-reverse-v" size="medium"
            />),
            tip: 'Direction:column-reverse',
            value: 'column-reverse',
          }]}
          onChange={(val) => utils.setPropertyValue(this.props, 'flex-direction', val)}
        />
        <ChoiceControl
          className="vs-style-flex-property"
          value={align}
          options={[{
            title: (
              <Icons
                className={reverseClass}
                name={`style.align-start${v}`}
                size="medium"
              />
            ),
            tip: 'Align:flex-start',
            value: 'flex-start',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.align-center${v}`}
                size="medium"
              />
            ),
            tip: 'Align:center',
            value: 'center',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.align-end${v}`}
                size="medium"
              />
            ),
            tip: 'Align:flex-end',
            value: 'flex-end',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.align-stretch${v}`}
                size="medium"
              />
            ),
            tip: 'Align:stretch',
            value: 'stretch',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.align-baseline${v}`}
                size="medium"
              />
            ),
            tip: 'Align:baseline',
            value: 'baseline',
          }]}
          onChange={(val) => utils.setPropertyValue(this.props, 'align-items', val)}
        />
        <ChoiceControl
          className="vs-style-flex-property"
          value={justify}
          options={[{
            title: (
              <Icons
                className={reverseClass}
                name={`style.justify-start${v}`}
                size="medium"
              />
            ),
            tip: 'Justify:flex-start',
            value: 'flex-start',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.justify-center${v}`}
                size="medium"
              />
            ),
            tip: 'Justify:center',
            value: 'center',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.justify-end${v}`}
                size="medium"
              />
            ),
            tip: 'Justify:flex-end',
            value: 'flex-end',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.justify-between${v}`}
                size="medium"
              />
            ),
            tip: 'Justify:space-between',
            value: 'space-between',
          }, {
            title: (
              <Icons
                className={reverseClass}
                name={`style.justify-around${v}`}
                size="medium"
              />
            ),
            tip: 'Justify:space-around',
            value: 'space-around',
          }]}
          onChange={(val) => utils.setPropertyValue(this.props, 'justify-content', val)}
        />
      </div>
    );
  }
}

export default Flex;
