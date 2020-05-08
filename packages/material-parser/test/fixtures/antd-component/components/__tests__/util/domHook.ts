const __NULL__ = { notExist: true };

type ElementType<P> = {
  prototype: P;
};

export function spyElementPrototypes<P extends {}>(Element: ElementType<P>, properties: P) {
  const propNames = Object.keys(properties);
  const originDescriptors = {};

  propNames.forEach(propName => {
    const originDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, propName);
    originDescriptors[propName] = originDescriptor || __NULL__;

    const spyProp = properties[propName];

    if (typeof spyProp === 'function') {
      // If is a function
      Element.prototype[propName] = function spyFunc(...args) {
        return spyProp.call(this, originDescriptor, ...args);
      };
    } else {
      // Otherwise tread as a property
      Object.defineProperty(Element.prototype, propName, {
        ...spyProp,
        set(value) {
          if (spyProp.set) {
            return spyProp.set.call(this, originDescriptor, value);
          }
          return originDescriptor.set(value);
        },
        get() {
          if (spyProp.get) {
            return spyProp.get.call(this, originDescriptor);
          }
          return originDescriptor.get();
        },
      });
    }
  });

  return {
    mockRestore() {
      propNames.forEach(propName => {
        const originDescriptor = originDescriptors[propName];
        if (originDescriptor === __NULL__) {
          delete Element.prototype[propName];
        } else if (typeof originDescriptor === 'function') {
          Element.prototype[propName] = originDescriptor;
        } else {
          Object.defineProperty(Element.prototype, propName, originDescriptor);
        }
      });
    },
  };
}

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T] &
  string;

export function spyElementPrototype<P extends {}, K extends FunctionPropertyNames<P>>(
  Element: ElementType<P>,
  propName: K,
  property: P[K],
) {
  return spyElementPrototypes(Element, {
    [propName]: property,
  });
}
