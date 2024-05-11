import { Component } from 'react';
import classNames from 'classnames';
import './index.less';

export interface DraggableLineProps {
  onDrag: (l: number, e: any) => any;
  onDragStart?: () => any;
  onDragEnd?: () => any;
  position?: 'right' | 'left' | 'top';
  className?: string;
  maxIncrement?: number;
  maxDecrement?: number;
}

export default class DraggableLine extends Component<DraggableLineProps> {
  static displayName = 'DraggableLine';

  static defaultProps = {
    onDrag() {},
    position: 'right',
    className: '',
    maxIncrement: 100,
    maxDecrement: 0,
  };

  private startDrag: boolean;
  private canDrag: boolean;
  private offset: number;
  private currentOffset: number;
  private offEvent: any;
  private offDragEvent: any;
  private startOffset: any;
  private shell: HTMLElement | null = null;

  constructor(props: DraggableLineProps) {
    super(props);
    this.startDrag = false;
    this.canDrag = false;
    this.offset = 0;
    this.currentOffset = 0;
  }

  componentDidMount() {
    this.offEvent = this.initEvent();
  }

  componentWillUnmount() {
    if (this.offEvent) {
      this.offEvent();
    }
  }

  onSelectStart(e: any) {
    if (this.startDrag) {
      e.preventDefault();
    }
  }

  onStartMove(e: any) {
    const { onDragStart } = this.props;
    if (!this.startDrag) {
      onDragStart && onDragStart();
    }
    this.startDrag = true;
    this.canDrag = true;
    this.currentOffset = 0;
    this.offDragEvent = this.initDragEvent();
    this.startOffset = this.getClientPosition(e);
  }

  onEndMove() {
    const { onDragEnd } = this.props;
    if (this.startDrag) {
      if (this.offDragEvent) {
        this.offDragEvent();
      }
      this.startDrag = false;
      this.offset = this.currentOffset;
    }
    onDragEnd && onDragEnd();
  }

  onDrag(e: any) {
    const { position, onDrag, maxIncrement = 100, maxDecrement = 0 } = this.props;
    if (this.startDrag) {
      if (position === 'left' || position === 'top') {
        this.currentOffset = this.offset + this.startOffset - this.getClientPosition(e);
      } else {
        this.currentOffset = this.offset + this.getClientPosition(e) - this.startOffset;
      }

      if (this.currentOffset < -maxDecrement) {
        this.currentOffset = -maxDecrement;
      } else if (this.currentOffset > maxIncrement) {
        this.currentOffset = maxIncrement;
      }

      onDrag(this.currentOffset, e);
    }
  }

  getClientPosition(e: any) {
    const { position } = this.props;
    return position === 'left' || position === 'right' ? e.clientX : e.clientY;
  }

  initEvent() {
    const selectStart = this.onSelectStart.bind(this);
    document.addEventListener('selectstart', selectStart);
    return () => document.removeEventListener('selectstart', selectStart);
  }

  initDragEvent() {
    const onDrag = this.onDrag.bind(this);
    const onEndMove = this.onEndMove.bind(this);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onEndMove);
    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onEndMove);
    };
  }

  getParent() {
    return this.shell?.parentElement;
  }

  render() {
    const { className = '', position } = this.props;

    return (
      <div
        ref={(ref) => { this.shell = ref; }}
        className={classNames(
          position === 'left' || position === 'right'
            ? 'lc-draggable-line-vertical'
            : 'lc-draggable-line-horizontal',
          {
            [className]: !!className,
          },
        )}
        onMouseDown={(e) => this.onStartMove(e)}
      />
    );
  }
}
