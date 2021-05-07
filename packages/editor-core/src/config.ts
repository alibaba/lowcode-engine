export class EngineConfig {
  private config: { [key: string]: any } = {};

  private waits = new Map<
  string,
  Array<{
    once?: boolean;
    resolve:(data: any) => void;
  }>
  >();

  constructor(config?: { [key: string]: any }) {
    this.config = config || {};
  }

  has(key: string): boolean {
    return this.config[key] !== undefined;
  }

  get(key: string): any {
    return this.config[key];
  }

  set(key: string, value: any) {
    this.config[key] = value;
    this.notifyGot(key);
  }

  setConfig(config: { [key: string]: any }) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this.set(key, config[key]);
      });
    }
  }

  onceGot(key: string): Promise<any> {
    const val = this.config[key];
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }

  onGot(key: string, fn: (data: any) => void): () => void {
    const val = this.config?.[key];
    if (val !== undefined) {
      fn(val);
      return () => {};
    } else {
      this.setWait(key, fn);
      return () => {
        this.delWait(key, fn);
      };
    }
  }

  private notifyGot(key: string) {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  private setWait(key: string, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: string, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}

export const engineConfig = new EngineConfig();
