import { uniqueId } from '../../../../utils/unique-id';
import { Component, ReactNode } from 'react';
import { saveTips } from './tip-handler';

export interface TipConfig {
  className?: string;
  children?: ReactNode;
  theme?: string;
  direction?: string; // 'n|s|w|e|top|bottom|left|right';
}

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
