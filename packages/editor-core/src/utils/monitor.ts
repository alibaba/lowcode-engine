class Monitor {
  fn = (params: any) => {
    const { AES } = window as any;
    if (typeof AES.log === 'function') {
      const { p1, p2, p3, p4 = 'OTHER', ...rest } = params || {};
      AES.log('event', {
        p1,
        p2,
        p3,
        p4,
        ...rest,
      });
    }
  };

  constructor() {
    (window as any).AES = (window as any).AES || {};
  }

  register(fn: () => any) {
    if (typeof fn === 'function') {
      this.fn = fn;
    }
  }

  log(params: any) {
    if (typeof this.fn === 'function') {
      this.fn(params);
    }
  }

  setConfig(key: string | object, value?: string): void {
    const { AES } = window as any;
    if (typeof AES?.setConfig !== 'function') {
      return;
    }
    if (typeof key === 'string' && value) {
      AES.setConfig(key, value);
    } else if (typeof key === 'object') {
      AES.setConfig(key);
    }
  }
}

const monitor = new Monitor();
export { monitor };
