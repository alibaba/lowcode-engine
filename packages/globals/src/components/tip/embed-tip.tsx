import { uniqueId } from '../../../../utils/unique-id';
import { Component } from 'react';
import { saveTips } from './tip-handler';
import { TipConfig } from '../../types';

export default class EmbedTip extends Component<TipConfig> {
  private id = uniqueId('tips$');

  componentWillUnmount() {
    saveTips(this.id, null);
  }

  render() {
    saveTips(this.id, this.props);
    return <meta data-role="tip" data-tip-id={this.id} />;
  }
}
