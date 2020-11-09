import { IocContext } from 'power-di';

// 原本的 canBeKey 里判断函数的方法是 instanceof Function，在某些 babel 编译 class 后的场景不满足该判断条件，此处暴力破解
IocContext.prototype.canBeKey = (obj: any) =>
  typeof obj === 'function' || ['string', 'symbol'].includes(typeof obj);

export * from 'power-di';

export const globalContext = IocContext.DefaultInstance;
