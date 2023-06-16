import { createContext, ReactNode, Component, PureComponent } from 'react';
import { Drawer, ConfigProvider } from '@alifd/next';
import { uniqueId } from '@alilc/lowcode-utils';
import { IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import './style.less';

export interface PopupExtProps {
  width?: number;
  hasMask?: boolean;
  trigger?: ReactNode;
  canCloseByOutSideClick?: boolean
  className?: string;
  safeNode?: string[];
}

interface PopupProps extends PopupExtProps{
  content?: ReactNode,
  title?: ReactNode,
  actionKey?: string
}


export const PopupContext = createContext<PopupPipe>({} as any);

export class PopupPipe {
  private emitter: IEventBus = createModuleEventBus('PopupPipe');

  private currentId?: string;

  create(props?: PopupExtProps): {
    send: (content: ReactNode, title: ReactNode) => void;
    show: (target: Element) => void;
  } {
    let sendContent: ReactNode = null;
    let sendTitle: ReactNode = null;
    const id = uniqueId('popup');
    return {
      send: (content: ReactNode, title: ReactNode) => {
        sendContent = content;
        sendTitle = title;
        if (this.currentId === id) {
          this.popup({
            ...props,
            content,
            title,
          });
        }
      },
      show: (target: Element, actionKey?: string) => {
        this.currentId = id;
        this.popup(
          {
            ...props,
            actionKey,
            content: sendContent,
            title: sendTitle,
          },
          target,
        );
      },
    };
  }

  private popup(props: PopupProps, target?: Element) {
    Promise.resolve().then(() => {
      this.emitter.emit('popupchange', props, target);
    });
  }

  onPopupChange(fn: (props: PopupProps, target?: Element) => void): () => void {
    this.emitter.on('popupchange', fn);
    return () => {
      this.emitter.removeListener('popupchange', fn);
    };
  }

  purge() {
    this.emitter.removeAllListeners();
  }
}

export default class PopupService extends Component<{
  popupPipe?: PopupPipe;
  actionKey?: string;
  safeId?: string;
  popupContainer?: string;
}> {
  private popupPipe = this.props.popupPipe || new PopupPipe();

  componentWillUnmount() {
    this.popupPipe.purge();
  }

  render() {
    const { children, actionKey, safeId, popupContainer } = this.props;
    return (
      <PopupContext.Provider value={this.popupPipe}>
        {children}
        <PopupContent key={`pop${actionKey}`} safeId={safeId} popupContainer={popupContainer} />
      </PopupContext.Provider>
    );
  }
}

interface StateType extends PopupProps {
  visible?: boolean, 
  offsetX?: number, 
  pos?: {top: number, height: number}
}
export class PopupContent extends PureComponent<{ safeId?: string; popupContainer?: string }> {
  static contextType = PopupContext;

  popupContainerId = uniqueId('popupContainer');

  state: StateType = {
    visible: false,
    offsetX: -300,
  };

  private dispose = (this.context as PopupPipe).onPopupChange((props, target) => {
    const state: StateType = {
      ...props,
      visible: true,
    };
    if (target) {
      const rect = target.getBoundingClientRect();
      state.pos = {
        top: rect.top,
        height: rect.height,
      };
      // todo: compute the align method
    }
    this.setState(state);
  });

  componentDidMount() {
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    if (clientWidth >= 1860) {
      this.setState({
        offsetX: -400,
      });
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { content, visible, title, actionKey, pos, offsetX, width = 360, hasMask = false, canCloseByOutSideClick = true, safeNode = [] } = this.state;
    if (!visible) {
      return null;
    }

    let avoidLaterHidden = true;
    setTimeout(() => {
      avoidLaterHidden = false;
    }, 10);

    const id = uniqueId('ball');

    return (
      <Drawer
        width={width}
        visible={visible}
        offset={[offsetX, 0]}
        hasMask={hasMask}
        onVisibleChange={(_visible, type) => {
          if (avoidLaterHidden) {
            return;
          }
          if (!_visible && type === 'closeClick') {
            this.setState({ visible: false });
          }
        }}
        trigger={<div className="lc-popup-placeholder" style={pos} />}
        triggerType="click"
        canCloseByOutSideClick={canCloseByOutSideClick}
        animation={false}
        onClose={this.onClose}
        id={this.props.safeId}
        safeNode={[id, ...safeNode]}
        closeable
        container={this.props.popupContainer}
      >
        <div className="lc-ballon-title">{title}</div>
        <div className="lc-ballon-content">
          <PopupService actionKey={actionKey} safeId={id} popupContainer={this.popupContainerId}>
            <ConfigProvider popupContainer={this.popupContainerId}>
              {content}
            </ConfigProvider>
          </PopupService>
        </div>
        <div id={this.popupContainerId} />
        <div id="engine-variable-setter-dialog" />
        <div id="engine-popup-container" />
      </Drawer>
    );
  }
}
