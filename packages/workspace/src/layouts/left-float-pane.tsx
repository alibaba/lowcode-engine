import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer, Focusable } from '@alilc/lowcode-editor-core';
import { Area, Panel } from '@alilc/lowcode-editor-skeleton';
import { IPublicApiProject } from '@alilc/lowcode-types';

@observer
export default class LeftFloatPane extends Component<{ area: Area<any, Panel> }> {
  private dispose?: () => void;

  private focusing?: Focusable;

  private shell: HTMLElement | null = null;

  componentDidMount() {
    const { area } = this.props;
    const triggerClose = (e: any) => {
      if (!area.visible) return;
      // 当 MouseEvent 的 target 为「插入占位符」时，不关闭当前 panel
      if (e.originalEvent?.target?.classList.contains('insertion')) return;
      // 假如当前操作 target 祖先节点中有属性 data-keep-visible-while-dragging="true" 代表该 target 所属 panel
      // 不希望 target 在 panel 范围内拖拽时关闭 panel
      const panelElem = e.originalEvent?.target.closest('div[data-keep-visible-while-dragging="true"]');
      if (panelElem) return;
      area.setVisible(false);
    };
    area.skeleton.editor.eventBus.on('designer.drag', triggerClose);

    this.dispose = () => {
      area.skeleton.editor.removeListener('designer.drag', triggerClose);
    };

    const project: IPublicApiProject | undefined = area.skeleton.editor.get('project');

    this.focusing = area.skeleton.focusTracker.create({
      range: (e) => {
        const target = e.target as HTMLElement;
        if (!target) {
          return false;
        }
        if (this.shell?.contains(target)) {
          return true;
        }
        // 点击了 iframe 内容，算失焦
        if ((document.querySelector('.lc-simulator-content-frame') as HTMLIFrameElement)?.contentWindow?.document.documentElement.contains(target)) {
          return false;
        }
        if (project?.simulatorHost?.contentWindow?.document.documentElement.contains(target)) {
          return false;
        }
        // 点击设置区
        if (document.querySelector('.lc-right-area')?.contains(target)) {
          return false;
        }
        // 点击非编辑区域的popup/dialog,插件栏左侧等不触发失焦
        if (!document.querySelector('.lc-workbench')?.contains(target)) {
          return true;
        }
        // 排除设置区，iframe 之后，都不算失焦
        if (document.querySelector('.lc-workbench-body')?.contains(target)) {
          return true;
        }
        const docks = area.current?.getAssocDocks();
        if (docks && docks?.length) {
          return docks.some(dock => dock.getDOMNode()?.contains(target));
        }
        return false;
      },
      onEsc: () => {
        this.props.area.setVisible(false);
      },
      onBlur: () => {
        this.props.area.setVisible(false);
      },
    });

    this.onEffect();
  }

  onEffect() {
    const { area } = this.props;
    if (area.visible) {
      this.focusing?.active();
      // 关闭当前fixed区域的面板
      // TODO: 看看有没有更合适的地方
      const fixedContainer = area?.skeleton?.leftFixedArea?.container;
      const currentFixed = fixedContainer?.current;
      if (currentFixed) {
        fixedContainer.unactive(currentFixed);
      }
    } else {
      this.focusing?.suspense();
    }
  }

  componentDidUpdate() {
    this.onEffect();
  }

  componentWillUnmount() {
    this.focusing?.purge();
    this.dispose?.();
  }

  render() {
    const { area } = this.props;
    const width = area.current?.config.props?.width;

    const style = width ? {
      width,
    } : undefined;
    return (
      <div
        ref={(ref) => { this.shell = ref; }}
        className={classNames('lc-left-float-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<any, Panel> }> {
  render() {
    const { area } = this.props;
    return (
      <Fragment>
        {area.container.items.map((panel) => panel.content)}
      </Fragment>
    );
  }
}
