import { IPublicTypeTipConfig } from '@alilc/lowcode-types';
import { IEventBus, createModuleEventBus } from '../../event-bus';

export interface TipOptions extends IPublicTypeTipConfig {
  target: HTMLElement;
}

class TipHandler {
  tip: TipOptions | null = null;

  private showDelay: number | null = null;

  private hideDelay: number | null = null;

  private emitter: IEventBus = createModuleEventBus('TipHandler');

  setTarget(target: HTMLElement) {
    const tip = findTip(target);
    if (tip) {
      if (this.tip) {
        // the some target should return
        if ((this.tip as any).target === (tip as any).target) {
          this.tip = tip;
          return;
        }
        // not show already, reset show delay
        if (this.showDelay) {
          clearTimeout(this.showDelay);
          this.showDelay = null;
          this.tip = null;
        } else {
          if (this.hideDelay) {
            clearTimeout(this.hideDelay);
            this.hideDelay = null;
          }
          this.tip = tip;
          this.emitter.emit('tipchange');
          return;
        }
      }

      this.tip = tip;
      if (this.hideDelay) {
        clearTimeout(this.hideDelay);
        this.hideDelay = null;
        this.emitter.emit('tipchange');
      } else {
        this.showDelay = setTimeout(() => {
          this.showDelay = null;
          this.emitter.emit('tipchange');
        }, 350) as any;
      }
    } else {
      if (this.showDelay) {
        clearTimeout(this.showDelay);
        this.showDelay = null;
      } else {
        this.hideDelay = setTimeout(() => {
          this.hideDelay = null;
        }, 100) as any;
      }
      this.tip = null;

      this.emitter.emit('tipchange');
    }
  }

  hideImmediately() {
    if (this.hideDelay) {
      clearTimeout(this.hideDelay);
      this.hideDelay = null;
    }
    if (this.showDelay) {
      clearTimeout(this.showDelay);
      this.showDelay = null;
    }
    this.tip = null;
    this.emitter.emit('tipchange');
  }

  onChange(func: () => void) {
    this.emitter.on('tipchange', func);
    return () => {
      this.emitter.removeListener('tipchange', func);
    };
  }
}

export const tipHandler = new TipHandler();

function findTip(target: HTMLElement | null): TipOptions | null {
  if (!target) {
    return null;
  }
  // optimize deep finding on mouseover
  let loopupLimit = 10;
  while (target && loopupLimit-- > 0) {
    // get tip from target node
    if (target.dataset && target.dataset.tip) {
      return {
        children: target.dataset.tip,
        direction: (target.dataset.direction || target.dataset.dir) as any,
        theme: target.dataset.theme,
        target,
      };
    }

    // or get tip from child nodes
    let child: HTMLElement | null = target.lastElementChild as HTMLElement;

    while (child) {
      if (child.dataset && child.dataset.role === 'tip') {
        const { tipId } = child.dataset;
        if (!tipId) {
          return null;
        }
        const tipProps = tipsMap.get(tipId);
        if (!tipProps) {
          return null;
        }
        return {
          ...tipProps,
          target,
        };
      }
      child = child.previousElementSibling as HTMLElement;
    }

    target = target.parentNode as HTMLElement;
  }

  return null;
}

const tipsMap = new Map<string, IPublicTypeTipConfig>();
export function postTip(id: string, props: IPublicTypeTipConfig | null) {
  if (props) {
    tipsMap.set(id, props);
  } else {
    tipsMap.delete(id);
  }
}
