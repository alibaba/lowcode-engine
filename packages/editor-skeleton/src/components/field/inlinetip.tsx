import * as React from 'react';

export interface InlineTipProps {
  position: string;
  theme?: 'green' | 'black';
  children: React.ReactNode;
}

export default class InlineTip extends React.Component<InlineTipProps> {
  static displayName = 'InlineTip';

  static defaultProps = {
    position: 'auto',
    theme: 'black',
  };

  render(): React.ReactNode {
    const { position, theme, children } = this.props;
    return (
      <div style={{ display: 'none' }} data-role="tip" data-position={position} data-theme={theme}>
        {children}
      </div>
    );
  }
}
