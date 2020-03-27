import { Component } from 'react';
import classNames from 'classnames';
import BuiltinDragGhostComponent from './drag-ghost';
import { Designer, DesignerProps } from './designer';
import { ProjectView } from '../project';
import './designer.less';

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
      nextProps.style != props.style ||
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
      </div>
    );
  }
}
