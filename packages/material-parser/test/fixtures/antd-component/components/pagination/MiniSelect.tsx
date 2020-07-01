import * as React from 'react';
import Select from '../select';

export default class MiniSelect extends React.Component<any, any> {
  static Option = Select.Option;

  render() {
    return <Select size="small" {...this.props} />;
  }
}
