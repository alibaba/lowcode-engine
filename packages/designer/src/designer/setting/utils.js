// all this file for polyfill vision logic

import { isValidElement } from 'react';
import { isSetterConfig } from '@ali/lowcode-types';
import { getSetter } from '@ali/lowcode-editor-core';

function getHotterFromSetter(setter) {
  return setter && (setter.Hotter || (setter.type && setter.type.Hotter)) || []; // eslint-disable-line
}

function getTransducerFromSetter(setter) {
  return (
    (setter &&
      (setter.transducer ||
        setter.Transducer ||
        (setter.type && (setter.type.transducer || setter.type.Transducer)))) ||
    null
  ); // eslint-disable-line
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
    let { setter } = config;

    // 1. validElement
    // 2. SetterConfig
    // 3. SetterConfig[]
    if (Array.isArray(setter)) {
      setter = setter[0];
    } else if (isValidElement(setter) && setter.type.displayName === 'MixedSetter') {
      setter = setter.props?.setters?.[0];
    } else if (typeof setter === 'object' && setter.componentName === 'MixedSetter') {
      setter = setter;
      setter.props && setter.props.setters && Array.isArray(setter.props.setters) && setter.props.setters[0];
    }

    if (isSetterConfig(setter)) {
      setter = setter.componentName;
    }
    if (typeof setter === 'string') {
      setter = getSetter(setter)?.component;
    }

    this.setterTransducer = combineTransducer(getTransducerFromSetter(setter), getHotterFromSetter(setter), context);
    this.context = context;
  }

  toHot(data) {
    return this.setterTransducer.toHot(data);
  }

  toNative(data) {
    return this.setterTransducer.toNative(data);
  }
}
