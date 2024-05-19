import { Component } from 'react';
import classNames from 'classnames';
import BuiltinDragGhostComponent from './drag-ghost';
import { Designer, DesignerProps, IDesigner } from './designer';
import { ProjectView } from '../project';
import './designer.less';

type IProps = DesignerProps & {
  designer?: IDesigner;
};

export class DesignerView extends Component<IProps> {
  readonly designer: IDesigner;
  readonly viewName: string | undefined;

  constructor(props: IProps) {
    super(props);
    const { designer, ...designerProps } = props;
    this.viewName = designer?.viewName;
    if (designer) {
      this.designer = designer;
      designer.setProps(designerProps);
    } else {
      this.designer = new Designer(designerProps);
    }
  }

  shouldComponentUpdate(nextProps: DesignerProps) {
    this.designer.setProps(nextProps);
    const { props } = this;
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
    this.designer.postEvent('mount', this.designer);
  }

  UNSAFE_componentWillMount() {
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
