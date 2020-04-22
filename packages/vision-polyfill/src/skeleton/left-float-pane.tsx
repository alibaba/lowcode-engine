import { Component, Fragment } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-globals';
import { Button, Icon } from '@alifd/next';
import Area from './area';
import Panel from './panel';

@observer
export default class LeftFloatPane extends Component<{ area: Area<any, Panel> }> {
  shouldComponentUpdate() {
    return false;
  }

  private dispose?: () => void;
  componentDidMount() {
    const { area } = this.props;
    const triggerClose = () => area.setVisible(false);
    area.skeleton.editor.on('designer.dragstart', triggerClose);
    this.dispose = () => {
      area.skeleton.editor.removeListener('designer.dragstart', triggerClose);
    }
  }

  componentWillUnmount() {
    this.dispose?.();
  }

  render() {
    const { area } = this.props;
    // TODO: add focusingManager
    // focusin set focus (push|replace)
    // focusout remove focus
    // onEsc
    const width = area.current?.config.props?.width;
    const style = width ? {
      width
    } : undefined;
    return (
      <div
        className={classNames('lc-left-float-pane', {
          'lc-area-visible': area.visible,
        })}
        style={style}
      >
        <Button
          text
          className="lc-pane-close"
          onClick={() => {
            area.setVisible(false);
          }}
        >
          <Icon type="close" />
        </Button>
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
