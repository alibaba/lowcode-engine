import { Component } from 'react';
import { TipItem } from './tip-item';
import { tipHandler } from './tip-handler';

export class TipContainer extends Component {
  shouldComponentUpdate() {
    return false;
  }

  private dispose?: () => void;

  componentDidMount() {
    const over = (e: MouseEvent) => tipHandler.setTarget(e.target as any);
    const down = () => tipHandler.hideImmediately();
    document.addEventListener('mouseover', over, false);
    document.addEventListener('mousedown', down, true);
    this.dispose = () => {
      document.removeEventListener('mouseover', over, false);
      document.removeEventListener('mousedown', down, true);
    };
  }

  UNSAFE_componentWillMount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  render() {
    return (
      <div className="lc-tips-container">
        <TipItem />
      </div>
    );
  }
}
