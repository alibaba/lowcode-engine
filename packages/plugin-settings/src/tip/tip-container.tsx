import { Component } from 'react';
import Tip from './tip';
import tipHandler from './tip-handler';

export default class TipContainer extends Component {
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

  componentWillMount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  render() {
    return (
      <div className="lc-tips-container">
        <Tip />
      </div>
    );
  }
}
