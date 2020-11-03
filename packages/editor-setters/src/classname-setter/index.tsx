import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@alife/next';

interface Color {
  rgb: any;
  onChange: () => void;
}

export interface PluginProps {
  value: string;
  onChange: any;
}

export default class ClassNameView extends PureComponent<PluginProps> {
  static display = 'ClassName';

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    onChange: () => {},
    value: '',
  };

  getClassNameList = () => {
    const { editor } = this.props.field;
    const schema = editor.get('designer').project.getSchema();
    const css = schema.componentsTree[0].css;
    const classNameList = [];
    const re = /\.?\w+[^{]+\{[^}]*\}/g;
    const list = css.match(re);
    list.map((item) => {
      if (item[0] === '.') {
        const className = item.substring(1, item.indexOf('{'));
        classNameList.push(className);
      }

      return item;
    });

    return classNameList;
  };


  handleChange = (value) => {
    const { onChange } = this.props;
    onChange(value.join(' '));
    this.setState({
      selectValue: value,
    });
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const { value } = this.props;
    const classnameList = this.getClassNameList();
    const dataSource = [];
    classnameList.map((item) => {
      dataSource.push({
        value: item,
        label: item,
      });

      return item;
    });


    let selectValue = [];
    if (value && value !== '') {
      selectValue = value.split(' ');
    }


    this.setState({
      dataSource,
      selectValue,
    });
  }


  render() {
    const { dataSource, selectValue } = this.state;
    return (
      <Select aria-label="tag mode" mode="tag" dataSource={dataSource} onChange={this.handleChange} value={selectValue} />
    );
  }
}
