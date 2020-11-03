function getHotterFromSetter(setter) {
  return setter && (setter.Hotter || (setter.type && setter.type.Hotter)) || []; // eslint-disable-line
}

function getTransducerFromSetter(setter) {
  return setter && (
    setter.transducer || setter.Transducer
      || (setter.type && (setter.type.transducer || setter.type.Transducer))
    ) || null; // eslint-disable-line
}

function combineTransducer(transducer, arr, context) {
  if (!transducer && Array.isArray(arr)) {
    const [toHot, toNative] = arr;
    transducer = { toHot, toNative };
  }

  return {
    toHot: (transducer && transducer.toHot || (x => x)).bind(context), // eslint-disable-line
    toNative: (transducer && transducer.toNative || (x => x)).bind(context), // eslint-disable-line
  };
}

export class Transducer {
  constructor(context, config) {
    this.setterTransducer = combineTransducer(
      getTransducerFromSetter(config.setter),
      getHotterFromSetter(config.setter),
      context,
    );
    this.context = context;
  }

  toHot(data) {
    return this.setterTransducer.toHot(data);
  }

  toNative(data) {
    return this.setterTransducer.toNative(data);
  }
}
