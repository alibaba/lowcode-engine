---
order: 11
title:
  zh-CN: 三种大小
  en-US: Three Sizes
---

## zh-CN

三种大小的输入框，若不设置，则为 `default`。

## en-US

The input box comes in three sizes. `default` will be used if `size` is omitted.

```jsx
import { DatePicker, Radio } from 'antd';

const { RangePicker } = DatePicker;

class PickerSizesDemo extends React.Component {
  state = {
    size: 'default',
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  render() {
    const { size } = this.state;
    return (
      <div>
        <Radio.Group value={size} onChange={this.handleSizeChange}>
          <Radio.Button value="large">Large</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="small">Small</Radio.Button>
        </Radio.Group>
        <br />
        <br />
        <DatePicker size={size} />
        <br />
        <DatePicker size={size} picker="month" />
        <br />
        <RangePicker size={size} />
        <br />
        <DatePicker size={size} picker="week" />
      </div>
    );
  }
}

ReactDOM.render(<PickerSizesDemo />, mountNode);
```
