import React, { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@alilc/lowcode-editor-core';
import StageChain from './stage-chain';
import Stage from './stage';
import { ISkeleton } from '../../skeleton';
import PopupService, { PopupPipe } from '../popup';
import { Stage as StageWidget } from '../../widget/stage';

export const StageBoxDefaultProps = {};

export type StageBoxProps = typeof StageBoxDefaultProps & {
  stageChain?: StageChain;
  className?: string;
  children: React.ReactNode;
  skeleton: ISkeleton;
};

type WillDetachMember = () => void;

@observer
export default class StageBox extends Component<StageBoxProps> {
  static defaultProps = StageBoxDefaultProps;

  static displayName = 'StageBox';

  private stageChain: StageChain;

  private willDetach: WillDetachMember[] = [];

  private shell: HTMLElement | null;

  private popupPipe = new PopupPipe();

  private pipe = this.popupPipe.create();

  constructor(props: StageBoxProps) {
    super(props);
    const { stageChain, children, skeleton } = this.props;
    if (stageChain) {
      this.stageChain = stageChain;
    } else {
      const stateName = skeleton.createStage({
        content: children,
        isRoot: true,
      });
      this.stageChain = new StageChain(skeleton.getStage(stateName as string) as StageWidget);
    }
    this.willDetach.push(this.stageChain.onStageChange(() => this.forceUpdate()));
  }

  componentDidMount() {
    const { shell } = this;

    /**
     * 向上层递归寻找 target
     * @param node 节点
     * @returns 节点的 dataset.stageTarget 信息
     */
    const getTarget = (node: HTMLElement | null): null | string => {
      if (!node || !shell?.contains(node) || (node.nodeName === 'A' && node.getAttribute('href'))) {
        return null;
      }

      const target = node.dataset ? node.dataset.stageTarget : null;
      if (target) {
        return target;
      }
      return getTarget(node.parentNode as HTMLElement);
    };

    const click = (e: MouseEvent) => {
      const target = getTarget(e.target as HTMLElement);
      if (!target) {
        return;
      }

      if (target === 'stageback') {
        this.stageChain.stageBack();
      } else if (target === 'stageexit') {
        this.stageChain.stageBackToRoot();
      } else {
        const { skeleton } = this.props;
        this.stageChain.stagePush(skeleton.getStage(target));
      }
    };

    shell?.addEventListener('click', click, false);
    this.willDetach.push(() => shell?.removeEventListener('click', click, false));
  }

  componentWillUnmount() {
    if (this.willDetach) {
      this.willDetach.forEach((off: () => void) => off());
    }
  }

  render() {
    const className = classNames('skeleton-stagebox', this.props.className);
    const stage = this.stageChain.getCurrentStage();
    const refer = stage?.getRefer();

    let contentCurrent = null;
    let contentRefer = null;

    if (refer) {
      contentCurrent = (
        <Stage key={stage.getId()} stage={stage} direction={refer.direction} current />
      );
      contentRefer = (
        <Stage key={refer?.stage?.getId()} stage={refer?.stage} direction={refer.direction} />
      );
    } else {
      contentCurrent = <Stage key={stage.getId()} stage={stage} current />;
    }

    return (
      <div
        ref={(ref) => {
          this.shell = ref;
        }}
        className={className}
      >
        {/* @ts-ignore */}
        <PopupService popupPipe={this.popupPipe}>
          {contentRefer}
          {contentCurrent}
        </PopupService>
      </div>
    );
  }
}
