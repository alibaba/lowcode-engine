import { useLayoutEffect, useRef, memo, type ComponentType, type CSSProperties } from 'react';
import classNames from 'classnames';
import { Designer } from '../../designer';
import BuiltinDragGhostComponent from '../drag-ghost';
import { ProjectView } from '../project-view';
import { DesignerContextProvider } from './context';

interface DesignerViewProps {
  className?: string;
  style?: CSSProperties;
  dragGhostComponent: ComponentType;
}

const DesignerView = memo(
  (props: DesignerViewProps) => {
    const { className, style, dragGhostComponent } = props;
    const designerRef = useRef(new Designer());

    // 组件挂载时执行
    useLayoutEffect(() => {
      designerRef.current.onMounted();

      return () => {
        designerRef.current.purge();
      };
    }, []);

    const DragGhost = dragGhostComponent || BuiltinDragGhostComponent;

    return (
      <DesignerContextProvider value={designerRef.current}>
        <div className={classNames('lc-designer', className)} style={style}>
          <DragGhost />
          <ProjectView />
        </div>
      </DesignerContextProvider>
    );
  },
  (prevProps, nextProps) => {
    if (
      nextProps.className !== prevProps.className ||
      nextProps.style !== prevProps.style ||
      nextProps.dragGhostComponent !== prevProps.dragGhostComponent
    ) {
      return true;
    }
    return false;
  },
);

export default DesignerView;
