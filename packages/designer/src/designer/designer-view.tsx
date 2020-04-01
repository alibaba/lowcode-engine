import { Component } from 'react';
import classNames from 'classnames';
import { TipContainer } from '@ali/lowcode-globals';
import BuiltinDragGhostComponent from './drag-ghost';
import { Designer, DesignerProps } from './designer';
import { ProjectView } from '../project';
import './designer.less';
import clipboard from './clipboard';

export class DesignerView extends Component<DesignerProps> {
  readonly designer: Designer;

  constructor(props: any) {
    super(props);
    this.designer = new Designer(props);
  }

  shouldComponentUpdate(nextProps: DesignerProps) {
    this.designer.setProps(nextProps);
    const props = this.props;
    if (
      nextProps.className !== props.className ||
      nextProps.style !== props.style ||
      nextProps.dragGhostComponent !== props.dragGhostComponent
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount(this.designer);
    }
    clipboard.injectCopyPaster(document)
    this.designer.postEvent('mount', this.designer);
  }

  componentWillMount() {
    this.designer.purge();
  }

  render() {
    const { className, style, dragGhostComponent } = this.props;
    const DragGhost = dragGhostComponent || BuiltinDragGhostComponent;

    return (
      <div className={classNames('lc-designer', className)} style={style}>
        <DragGhost designer={this.designer} />
        <ProjectView designer={this.designer} />
        <TipContainer />
      </div>
    );
  }
}
