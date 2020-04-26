import { createContext, ReactNode, Component, PureComponent } from 'react';
import { EventEmitter } from 'events';
import { Balloon } from '@alifd/next';
import { uniqueId } from '@ali/lowcode-utils';
import './style.less';

export const PopupContext = createContext<PopupPipe>({} as any);

export class PopupPipe {
  private emitter = new EventEmitter();
  private currentId?: string;

  create(props?: object): { send: (content: ReactNode, title: ReactNode) => void; show: (target: Element) => void } {
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

  private popup(props: object, target?: Element) {
    Promise.resolve().then(() => {
      this.emitter.emit('popupchange', props, target);
    });
  }

  onPopupChange(fn: (props: object, target?: Element) => void): () => void {
    this.emitter.on('popupchange', fn);
    return () => {
      this.emitter.removeListener('popupchange', fn);
    };
  }

  purge() {
    this.emitter.removeAllListeners();
  }
}

export default class PopupService extends Component<{ actionKey?: string; safeId?: string }> {
  private popupPipe = new PopupPipe();

  componentWillUnmount() {
    this.popupPipe.purge();
  }

  render() {
    const { children, actionKey, safeId } = this.props;
    return (
      <PopupContext.Provider value={this.popupPipe}>
        {children}
        <PopupContent key={'pop' + actionKey} safeId={safeId} />
      </PopupContext.Provider>
    );
  }
}

export class PopupContent extends PureComponent<{ safeId?: string }> {
  static contextType = PopupContext;
  state: any = {
    visible: false,
    pos: {},
  };

  private dispose = (this.context as PopupPipe).onPopupChange((props, target) => {
    const state: any = {
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

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const { content, visible, width, title, pos, actionKey } = this.state;
    if (!visible) {
      return null;
    }
    let avoidLaterHidden = true;
    setTimeout(() => {
      avoidLaterHidden = false;
    }, 10);

    const id = uniqueId('ball');

    return (
      <Balloon
        className="lc-ballon"
        align="l"
        id={this.props.safeId}
        safeNode={id}
        visible={visible}
        style={{ width }}
        onVisibleChange={(visible) => {
          if (avoidLaterHidden) {
            return;
          }
          if (!visible) {
            this.setState({ visible: false });
          }
        }}
        trigger={<div className="lc-popup-placeholder" style={pos} />}
        triggerType="click"
        animation={false}
        // needAdjust
        shouldUpdatePosition
      >
        <div className="lc-ballon-title">{title}</div>
        <div className="lc-ballon-content">
          <PopupService actionKey={actionKey} safeId={id}>
            {content}
          </PopupService>
        </div>
      </Balloon>
    );
  }
}
