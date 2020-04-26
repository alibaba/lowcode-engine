import { Component } from 'react';
import { TipConfig } from '@ali/lowcode-types';
import { uniqueId } from '@ali/lowcode-utils';
import { postTip } from './tip-handler';

export class Tip extends Component<TipConfig> {
  private id = uniqueId('tips$');

  componentWillUnmount() {
    postTip(this.id, null);
  }

  render() {
    postTip(this.id, this.props);
    return <meta data-role="tip" data-tip-id={this.id} />;
  }
}
