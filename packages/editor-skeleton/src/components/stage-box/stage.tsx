// @todo 改成 hooks
import React, { Component } from 'react';
import classNames from 'classnames';
import { IconArrow } from '../../icons/arrow';
import { IconExit } from '../../icons/exit';
import { Stage as StageWidget } from '../../widget/stage';
import { isTitleConfig } from '@alilc/lowcode-utils';

export const StageDefaultProps = {
  current: false,
};

export type StageProps = typeof StageDefaultProps & {
  stage?: StageWidget;
  current: boolean;
  direction?: string;
};

export default class Stage extends Component<StageProps> {
  static defaultProps = StageDefaultProps;

  private timer: number;

  private additionClassName: string | null;

  private shell: any;

  componentDidMount() {
    this.doSkate();
  }

  componentDidUpdate() {
    this.doSkate();
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  doSkate() {
    window.clearTimeout(this.timer);
    if (this.additionClassName) {
      this.timer = window.setTimeout(() => {
        const elem = this.shell;
        if (elem) {
          if (this.props.current) {
            elem.classList.remove(this.additionClassName);
          } else {
            elem.classList.add(this.additionClassName);
          }
          this.additionClassName = null;
        }
      }, 15);
    }
  }

  render() {
    const { stage, current, direction } = this.props;
    const content = stage?.getContent();
    const { title } = stage!;
    const newTitle = isTitleConfig(title) ? title.label : title;

    if (current) {
      if (direction) {
        this.additionClassName = `skeleton-stagebox-stagein-${direction}`;
      }
    } else if (direction) {
      this.additionClassName = `skeleton-stagebox-stageout-${direction}`;
    }

    const className = classNames(
      'skeleton-stagebox-stage',
      {
        'skeleton-stagebox-refer': !current,
      },
      this.additionClassName,
    );

    const stageBacker = stage?.hasBack() ? (
      <div className="skeleton-stagebox-stagebacker">
        <IconArrow
          className="skeleton-stagebox-stage-arrow"
          size="medium"
          data-stage-target="stageback"
        />
        <span className="skeleton-stagebox-stage-title">{newTitle as any}</span>
        <IconExit
          className="skeleton-stagebox-stage-exit"
          size="medium"
          data-stage-target="stageexit"
        />
      </div>
    ) : null;

    return (
      <div
        ref={(ref) => {
          this.shell = ref;
        }}
        className={className}
      >
        {stageBacker}
        <div className="skeleton-stagebox-stage-content">{content}</div>
      </div>
    );
  }
}
