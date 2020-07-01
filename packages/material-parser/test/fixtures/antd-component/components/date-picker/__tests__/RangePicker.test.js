import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import DatePicker from '..';
import { setMockDate, resetMockDate } from '../../../tests/utils';
import { openPicker, selectCell, closePicker } from './utils';
import focusTest from '../../../tests/shared/focusTest';

const { RangePicker } = DatePicker;

describe('RangePicker', () => {
  focusTest(RangePicker, true);

  beforeEach(() => {
    setMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });

  // issue: https://github.com/ant-design/ant-design/issues/5872
  it('should not throw error when value is reset to `[]`', () => {
    const birthday = moment('2000-01-01', 'YYYY-MM-DD');
    const wrapper = mount(<RangePicker value={[birthday, birthday]} open />);
    wrapper.setProps({ value: [] });

    expect(() => {
      openPicker(wrapper);
      selectCell(wrapper, 3);
      closePicker(wrapper);

      openPicker(wrapper, 1);
      selectCell(wrapper, 5, 1);
      closePicker(wrapper, 1);
    }).not.toThrow();
  });

  it('customize separator', () => {
    const wrapper = mount(<RangePicker separator="test" />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/13302
  describe('in "month" mode, when the left and right panels select the same month', () => {
    it('the cell status is correct', () => {
      class Test extends React.Component {
        state = {
          value: null,
        };

        onPanelChange = value => {
          this.setState({ value });
        };

        render() {
          return (
            <RangePicker
              value={this.state.value}
              mode={['month', 'month']}
              onPanelChange={this.onPanelChange}
            />
          );
        }
      }
      const wrapper = mount(<Test />);
      openPicker(wrapper);
      selectCell(wrapper, 'Feb');
      openPicker(wrapper, 1);
      selectCell(wrapper, 'Feb');
      closePicker(wrapper, 1);

      const { value } = wrapper.state();

      expect(value[0].isSame(value[1], 'date')).toBeTruthy();
    });
  });
});
