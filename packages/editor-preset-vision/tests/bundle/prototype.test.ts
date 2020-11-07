import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import divPrototypeConfig from '../fixtures/prototype/div-vision';
import divPrototypeMeta from '../fixtures/prototype/div-meta';
// import VisualEngine from '../../src';
import { designer } from '../../src/editor';
import Prototype from '../../src/bundle/prototype';
import { Editor } from '@ali/lowcode-editor-core';
// import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';


describe('Prototype', () => {
  it('构造函数 - OldPrototypeConfig', () => {
    const proto = new Prototype(divPrototypeConfig);
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe('http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md');
    expect(proto.getIcon()).toBeUndefined;
    expect(proto.getTitle()).toBe('Div');
    expect(proto.isPrototype).toBeTruthy;
    expect(proto.isContainer()).toBeTruthy;
    expect(proto.isModal()).toBeFalsy;
  });
  it('构造函数 - ComponentMetadata', () => {
    const proto = new Prototype(divPrototypeMeta);
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe('http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md');
    expect(proto.getIcon()).toBeUndefined;
    expect(proto.getTitle()).toBe('Div');
    expect(proto.isPrototype).toBeTruthy;
    expect(proto.isContainer()).toBeTruthy;
    expect(proto.isModal()).toBeFalsy;
  });
  it('构造函数 - ComponentMeta', () => {
    const meta = designer.createComponentMeta(divPrototypeMeta);
    const proto = new Prototype(meta);
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe('http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md');
    expect(proto.getIcon()).toBeUndefined;
    expect(proto.getTitle()).toBe('Div');
    expect(proto.isPrototype).toBeTruthy;
    expect(proto.isContainer()).toBeTruthy;
    expect(proto.isModal()).toBeFalsy;
  });
  it('构造函数 - 静态函数 create', () => {
    const proto = Prototype.create(divPrototypeConfig);
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe('http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md');
    expect(proto.getIcon()).toBeUndefined;
    expect(proto.getTitle()).toBe('Div');
    expect(proto.isPrototype).toBeTruthy;
    expect(proto.isContainer()).toBeTruthy;
    expect(proto.isModal()).toBeFalsy;
  });
  it('构造函数 - lookup: true', () => {
    const proto = Prototype.create(divPrototypeConfig);
    const proto2 = Prototype.create(divPrototypeConfig, {}, true);
    expect(proto).toBe(proto2);
  });
});
