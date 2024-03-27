function getHotterFromSetter(setter: any) {
  return (setter && (setter.Hotter || (setter.type && setter.type.Hotter))) || []; // eslint-disable-line
}

function getTransducerFromSetter(setter: any) {
  return (
    (setter &&
      (setter.transducer ||
        setter.Transducer ||
        (setter.type && (setter.type.transducer || setter.type.Transducer)))) ||
    null
  ); // eslint-disable-line
}

function combineTransducer(transducer: any, arr: any, context: any) {
  if (!transducer && Array.isArray(arr)) {
    const [toHot, toNative] = arr;
    transducer = { toHot, toNative };
  }

  return {
    toHot: ((transducer && transducer.toHot) || ((x: any) => x)).bind(context), // eslint-disable-line
    toNative: ((transducer && transducer.toNative) || ((x: any) => x)).bind(context), // eslint-disable-line
  };
}

export class Transducer {
  context: any;
  setterTransducer: any;

  constructor(context: any, config: any) {
    this.setterTransducer = combineTransducer(
      getTransducerFromSetter(config.setter),
      getHotterFromSetter(config.setter),
      context,
    );
    this.context = context;
  }

  toHot(data: any) {
    return this.setterTransducer.toHot(data);
  }

  toNative(data: any) {
    return this.setterTransducer.toNative(data);
  }
}
