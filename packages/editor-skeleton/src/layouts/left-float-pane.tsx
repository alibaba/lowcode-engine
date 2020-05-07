import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer, Focusable, focusTracker } from '@ali/lowcode-editor-core';
import { Button, Icon } from '@alifd/next';
import Area from '../area';
import Panel from '../widget/panel';

@observer
export default class LeftFloatPane extends Component<{ area: Area<any, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }

  private dispose?: () => void;
  private focusing?: Focusable;
  private shell: HTMLElement | null = null;
  componentDidMount() {
    const { area } = this.props;
    const triggerClose = () => area.setVisible(false);
    area.skeleton.editor.on('designer.dragstart', triggerClose);
    this.dispose = () => {
      area.skeleton.editor.removeListener('designer.dragstart', triggerClose);
    }

    this.focusing = focusTracker.create({
      range: this.shell!,
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
    const hideTitleBar = area.current?.config.props?.hideTitleBar;
    const style = width ? {
      width
    } : undefined;
    return (
      <div
        ref={(ref) => { this.shell = ref }}
        className={classNames('lc-left-float-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        {
          !hideTitleBar && (
            <Button
              text
              className="lc-pane-close"
              onClick={() => {
                area.setVisible(false);
              }}
            >
              <Icon type="close" />
            </Button>
          )
        }
        <Contents area={area} />
      </div>
    );
  }
}

@observer
class Contents extends Component<{ area: Area<any, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { area } = this.props;
    return (
      <Fragment>
        {area.container.items.map((panel) => panel.content)}
      </Fragment>
    );
  }
}
