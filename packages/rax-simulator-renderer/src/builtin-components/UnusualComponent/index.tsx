import { Component } from 'rax';
import lg from '@ali/vu-logger';

import './index.less';

export class UnknownComponent extends Component {
  props: {
    _componentName: string;
  };

  render() {
    lg.log('ERROR_NO_COMPONENT_VIEW');
    lg.error('Error component information:', this.props);
    return <div className="engine-unknow-component">组件 {this.props._componentName} 无视图，请打开控制台排查</div>;
  }
}

export class FaultComponent extends Component {
  props: {
    _componentName: string;
  };

  render() {
    return <div className="engine-fault-component">组件 {this.props._componentName} 渲染错误，请打开控制台排查</div>;
  }
}

export class HiddenComponent extends Component {
  render() {
    return <div className="engine-hidden-component">在本页面不显示</div>;
  }
}

export default { FaultComponent, HiddenComponent, UnknownComponent };
