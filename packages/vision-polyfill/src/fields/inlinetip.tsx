import { Component } from 'react';

export interface InlineTipProps {
  position: string;
  theme?: 'green' | 'black';
  children: React.ReactNode;
}

export default class InlineTip extends Component<InlineTipProps> {
  public static displayName = 'InlineTip';

  public static defaultProps = {
    position: 'auto',
    theme: 'black',
  };

  public render(): React.ReactNode {
    const { position, theme, children } = this.props;
    return (
      <div
        style={{ display: 'none' }}
        data-role="tip"
        data-position={position}
        data-theme={theme}
      >
        {children}
      </div>
    );
  }
}
