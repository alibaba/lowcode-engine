import { Component } from 'react';
import classNames from 'classnames';
import { IPublicTypeTipConfig } from '@alilc/lowcode-types';
import { intl } from '../../intl';
import { resolvePosition } from './utils';
import { tipHandler } from './tip-handler';

export class TipItem extends Component {
  private dispose?: () => void;

  constructor(props: any) {
    super(props);
    this.dispose = tipHandler.onChange(() => this.forceUpdate());
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.updateTip();
  }

  componentDidUpdate() {
    this.updateTip();
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
    this.clearTimer();
  }

  private timer: number | null = null;

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private shell: HTMLDivElement | null = null;

  private originClassName = '';

  updateTip() {
    if (!this.shell) {
      return;
    }
    const { shell } = this;
    const arrow = shell.querySelector('.lc-arrow') as HTMLElement;

    // reset
    shell.className = this.originClassName;
    shell.style.cssText = '';
    arrow.style.cssText = '';
    this.clearTimer();

    const { tip } = tipHandler;
    if (!tip) {
      return;
    }

    const { target, direction } = tip;
    const targetRect = target.getBoundingClientRect();

    if (targetRect.width === 0 || targetRect.height === 0) {
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    const bounds = {
      left: 1,
      top: 1,
      right: document.documentElement.clientWidth - 1,
      bottom: document.documentElement.clientHeight - 1,
    };

    const arrowRect = arrow.getBoundingClientRect();
    const { dir, left, top, arrowLeft, arrowTop } = resolvePosition(
      shellRect,
      targetRect,
      arrowRect,
      bounds,
      direction,
    );

    shell.classList.add(`lc-align-${dir}`);
    shell.style.top = `${top}px`;
    shell.style.left = `${left}px`;
    shell.style.width = `${shellRect.width}px`;
    shell.style.height = `${shellRect.height}px`;

    if (dir === 'top' || dir === 'bottom') {
      arrow.style.left = `${arrowLeft}px`;
    } else {
      arrow.style.top = `${arrowTop}px`;
    }
    this.timer = window.setTimeout(() => {
      shell.classList.add('lc-visible-animate');
      shell.style.transform = 'none';
    }, 10); /**/
  }

  render() {
    const tip: IPublicTypeTipConfig = tipHandler.tip || ({} as any);
    const className = classNames(
      'lc-tip',
      tip.className,
      tip && tip.theme ? `lc-theme-${tip.theme}` : null,
    );

    this.originClassName = className;

    return (
      <div
        className={className}
        ref={(ref) => {
          this.shell = ref;
        }}
      >
        <i className="lc-arrow" />
        <div className="lc-tip-content">{intl((tip as any).children)}</div>
      </div>
    );
  }
}
