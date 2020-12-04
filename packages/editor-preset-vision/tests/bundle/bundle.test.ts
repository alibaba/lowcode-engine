import { Component } from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import divPrototypeConfig from '../fixtures/prototype/div-vision';
import trunk from '../../src/bundle/trunk';
import Prototype from '../../src/bundle/prototype';
import Bundle from '../../src/bundle/bundle';
import { Editor } from '@ali/lowcode-editor-core';

jest.mock('../../src/bundle/trunk', () => {
  // mockComponentPrototype = jest.fn();
  // return {
  //   mockComponentPrototype: jest.fn().mockImplementation(() => {
  //     return proto;
  //   }),
  // }
  // return jest.fn().mockImplementation(() => {
  //   return {playSoundFile: fakePlaySoundFile};
  // });
  // return jest.fn().mockImplementation(() => {
  //   return { mockComponentPrototype };
  // });
  return {
    __esModule: true,
    default: {
      mockComponentPrototype: jest.fn(),
    },
  };
});

function wrap(name, thing) {
  return {
    name,
    componentName: name,
    category: '布局',
    module: thing,
  };
}

const proto1 = new Prototype(divPrototypeConfig);
const protoConfig2 = cloneDeep(divPrototypeConfig);
set(protoConfig2, 'componentName', 'Div2');
const proto2 = new Prototype(protoConfig2);

const protoConfig3 = cloneDeep(divPrototypeConfig);
set(protoConfig3, 'componentName', 'Div3');
const proto3 = new Prototype(protoConfig3);

const protoConfig4 = cloneDeep(divPrototypeConfig);
set(protoConfig4, 'componentName', 'Div4');
const proto4 = new Prototype(protoConfig4);

const protoConfig5 = cloneDeep(divPrototypeConfig);
set(protoConfig5, 'componentName', 'Div5');
const proto5 = new Prototype(protoConfig5);

function getComponentProtos() {
  return [
    wrap('Div', proto1),
    // wrap('Div2', proto2),
    // wrap('Div3', proto3),
    wrap('DivPortal', [proto2, proto3]),
  ];
}

class Div extends Component {}
Div.displayName = 'Div';
class Div2 extends Component {}
Div2.displayName = 'Div2';
class Div3 extends Component {}
Div3.displayName = 'Div3';
class Div4 extends Component {}
Div4.displayName = 'Div4';
class Div5 extends Component {}
Div5.displayName = 'Div5';

function getComponentViews() {
  return [
    wrap('Div', Div),
    // wrap('Div2', Div2),
    // wrap('Div3', Div3),
    wrap('DivPortal', [Div2, Div3]),
  ];
}

describe('Bundle', () => {
  it('构造函数', () => {
    const protos = getComponentProtos();
    const views = getComponentViews();
    const bundle = new Bundle(protos, views);
    expect(bundle.getList()).toHaveLength(3);
    expect(bundle.get('Div')).toBe(proto1);
    expect(bundle.get('Div2')).toBe(proto2);
    expect(bundle.get('Div3')).toBe(proto3);
    bundle.addComponentBundle([proto4, Div4]);
    expect(bundle.getList()).toHaveLength(4);
    expect(bundle.get('Div4')).toBe(proto4);
    bundle.replacePrototype('Div4', proto3);
    expect(proto3.getView()).toBe(Div4);

    bundle.removeComponentBundle('Div2');
    expect(bundle.getList()).toHaveLength(3);
    expect(bundle.get('Div2')).toBeUndefined;

    expect(bundle.getFromMeta('Div')).toBe(proto1);
    bundle.getFromMeta('Div5');
    expect(bundle.getList()).toHaveLength(4);
  });
  it('静态方法 create', () => {
    const protos = getComponentProtos();
    const views = getComponentViews();
    const bundle = Bundle.create(protos, views);
    expect(bundle).toBeTruthy();
  });
});
