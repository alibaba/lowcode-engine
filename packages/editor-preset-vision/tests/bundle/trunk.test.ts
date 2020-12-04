import { Component } from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import divPrototypeConfig from '../fixtures/prototype/div-vision';
import Prototype from '../../src/bundle/prototype';
import Bundle from '../../src/bundle/bundle';
import trunk from '../../src/bundle/trunk';
import lg from '@ali/vu-logger';

const proto1 = new Prototype(divPrototypeConfig);
const protoConfig2 = cloneDeep(divPrototypeConfig);
set(protoConfig2, 'componentName', 'Div2');
const proto2 = new Prototype(protoConfig2);

const protoConfig3 = cloneDeep(divPrototypeConfig);
set(protoConfig3, 'componentName', 'Div3');
const proto3 = new Prototype(protoConfig3);

const mockComponentPrototype = jest.fn();
jest.mock('../../src/bundle/bundle', () => {
  // return {
  //   mockComponentPrototype: jest.fn().mockImplementation(() => {
  //     return proto;
  //   }),
  // }
  // return jest.fn().mockImplementation(() => {
  //   return {playSoundFile: fakePlaySoundFile};
  // });
  return jest.fn().mockImplementation(() => {
    return {
      get: () => {},
      getList: () => { return []; },
      getFromMeta: () => {},
    };
  });
});

const mockError = jest.fn();
jest.mock('@ali/vu-logger');
lg.error = mockError;

function wrap(name, thing) {
  return {
    name,
    componentName: name,
    category: '布局',
    module: thing,
  };
}

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

function getComponentViews() {
  return [
    wrap('Div', Div),
    // wrap('Div2', Div2),
    // wrap('Div3', Div3),
    wrap('DivPortal', [Div2, Div3]),
  ];
}

describe('Trunk', () => {
  it('构造函数', () => {
    const warn = console.warn = jest.fn();
    const trunkChangeHandler = jest.fn();
    const off = trunk.onTrunkChange(trunkChangeHandler);
    trunk.addBundle(new Bundle([proto1], [Div]));
    trunk.addBundle(new Bundle([proto2], [Div2]));
    expect(trunkChangeHandler).toHaveBeenCalledTimes(2);
    off();
    trunk.addBundle(new Bundle([proto3], [Div3]));
    expect(trunkChangeHandler).toHaveBeenCalledTimes(2);
    trunk.getList();
    trunk.getPrototype('Div');
    trunk.getPrototypeById('Div');
    trunk.getPrototypeView('Div');
    trunk.listByCategory();
    expect(trunk.mockComponentPrototype(new Bundle([proto3], [Div3]))).toBeUndefined;
    expect(mockError).toHaveBeenCalled();
    trunk.registerComponentPrototypeMocker({ mockPrototype: jest.fn().mockImplementation(() => { return proto3; }) });
    expect(trunk.mockComponentPrototype(new Bundle([proto3], [Div3]))).toBe(proto3);
    const hahaSetter = () => 'haha';
    trunk.registerSetter('haha', hahaSetter);
    expect(trunk.getSetter('haha')).toBe(hahaSetter);
    trunk.getRecents(5);
    trunk.setPackages();
    expect(warn).toHaveBeenCalledTimes(1);
    trunk.beforeLoadBundle();
    expect(warn).toHaveBeenCalledTimes(2);
    trunk.afterLoadBundle();
    expect(warn).toHaveBeenCalledTimes(3);
    trunk.getBundle();
    expect(warn).toHaveBeenCalledTimes(4);
    expect(trunk.isReady()).toBeTruthy;
  });
});
