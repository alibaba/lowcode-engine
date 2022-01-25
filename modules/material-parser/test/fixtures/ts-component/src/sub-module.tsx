import * as React from 'react';

interface Props {
  name: string;
}

class SubModule extends React.Component<Props> {
  static defaultProps = {
    name: 'abc',
  };

  render() {
    const { name } = this.props;
    return <div>hello, {name}</div>;
  }
}

SubModule.defaultProps = {
  name: 'abc',
};

export default SubModule;
