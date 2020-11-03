import { createContext, ReactNode, Component, PureComponent } from 'react';
import { EventEmitter } from 'events';
import { Drawer } from '@alifd/next';
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

export default class PopupService extends Component<{ popupPipe?: PopupPipe; actionKey?: string; safeId?: string }> {
  private popupPipe = this.props.popupPipe || new PopupPipe();

  componentWillUnmount() {
    this.popupPipe.purge();
  }


  render() {
    const { children, actionKey, safeId } = this.props;
    return (
      <PopupContext.Provider value={this.popupPipe}>
        {children}
        <PopupContent key={`pop${ actionKey}`} safeId={safeId} />
      </PopupContext.Provider>
    );
  }
}

export class PopupContent extends PureComponent<{ safeId?: string }> {
  static contextType = PopupContext;

  state: any = {
    visible: false,
    offsetX: -300,
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
    const { content, visible, title, actionKey, offsetX } = this.state;
    if (!visible) {
      return null;
    }


    const id = uniqueId('ball');

    return (
      <Drawer
        width={360}
        visible={visible}
        offset={[offsetX, 0]}
        hasMask={false}
        triggerType="click"
        canCloseByOutSideClick={false}
        animation={false}
        onClose={this.onClose}
        id={this.props.safeId}
        safeNode={id}
        closeable
      >
        <div className="lc-ballon-title">{title}</div>
        <div className="lc-ballon-content">
          <PopupService actionKey={actionKey} safeId={id}>
            {content}
          </PopupService>
        </div>
      </Drawer>
    );
  }
}
