import { Component } from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import divPrototypeConfig from '../fixtures/prototype/div-vision';
import divFullPrototypeConfig from '../fixtures/prototype/div-vision-full';
import divPrototypeMeta from '../fixtures/prototype/div-meta';
// import VisualEngine from '../../src';
import { designer } from '../../src/editor';
import Prototype, { isPrototype } from '../../src/bundle/prototype';
import { Editor } from '@ali/lowcode-editor-core';
// import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';

describe('Prototype', () => {
  it('构造函数 - OldPrototypeConfig', () => {
    const proto = new Prototype(divPrototypeConfig);
    expect(isPrototype(proto)).toBeTruthy;
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe(
      'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
    );
    expect(proto.getIcon()).toBeUndefined;
    expect(proto.getTitle()).toBe('Div');
    expect(proto.isPrototype).toBeTruthy;
    expect(proto.isContainer()).toBeTruthy;
    expect(proto.isModal()).toBeFalsy;
  });
  it('构造函数 - 全量 OldPrototypeConfig', () => {
    const proto = new Prototype(divFullPrototypeConfig);
    expect(isPrototype(proto)).toBeTruthy;
    expect(proto.getComponentName()).toBe('Div');
    expect(proto.getId()).toBe('Div');
    expect(proto.getCategory()).toBe('布局');
    expect(proto.getDocUrl()).toBe(
      'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
    );
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
    expect(proto.getDocUrl()).toBe(
      'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
    );
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
    expect(proto.getDocUrl()).toBe(
      'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
    );
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
    expect(proto.getDocUrl()).toBe(
      'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
    );
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
  describe('类成员函数', () => {
    let proto: Prototype = null;
    beforeEach(() => {
      proto = new Prototype(divPrototypeConfig);
    });
    afterEach(() => {
      proto = null;
    });
    it('各种函数', () => {
      expect(proto.componentName).toBe('Div');
      expect(proto.getComponentName()).toBe('Div');
      expect(proto.getId()).toBe('Div');
      expect(proto.getContextInfo('anything')).toBeUndefined;
      expect(proto.getPropConfigs()).toBe(divPrototypeConfig);
      expect(proto.getConfig()).toBe(divPrototypeConfig);
      expect(proto.getConfig('componentName')).toBe('Div');
      expect(proto.getConfig('configure')).toBe(divPrototypeConfig.configure);
      expect(proto.getConfig('docUrl')).toBe(
        'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
      );
      expect(proto.getConfig('title')).toBe('容器');
      expect(proto.getConfig('isContainer')).toBeTruthy;

      class MockView extends Component {}

      expect(proto.getView()).toBeUndefined;
      proto.setView(MockView);
      expect(proto.getView()).toBe(MockView);
      expect(proto.meta.getMetadata().experimental?.view).toBe(MockView);

      expect(proto.getPackageName()).toBeUndefined;
      proto.setPackageName('@ali/vc-div');
      expect(proto.getPackageName()).toBe('@ali/vc-div');

      expect(proto.getConfig('category')).toBe('布局');
      proto.setCategory('布局 new');
      expect(proto.getConfig('category')).toBe('布局 new');

      expect(proto.getConfigure()).toHaveLength(3);
      expect(proto.getConfigure()[0].name).toBe('#props');
      expect(proto.getConfigure()[1].name).toBe('#styles');
      expect(proto.getConfigure()[2].name).toBe('#advanced');

      expect(proto.getRectSelector()).toBeUndefined;
      expect(proto.isAutoGenerated()).toBeFalsy;
    });
  });

  describe('类成员函数', () => {
    it('addGlobalPropsConfigure', () => {
      Prototype.addGlobalPropsConfigure({
        name: 'globalInsertProp1',
      });
      const proto1 = new Prototype(divPrototypeConfig);
      expect(proto1.getConfigure()[2].items).toHaveLength(4);
      expect(proto1.getConfigure()[2].items[3].name).toBe('globalInsertProp1');
      Prototype.addGlobalPropsConfigure({
        name: 'globalInsertProp2',
      });
      const proto2 = new Prototype(divPrototypeConfig);
      expect(proto2.getConfigure()[2].items).toHaveLength(5);
      expect(proto1.getConfigure()[2].items[4].name).toBe('globalInsertProp2');

      Prototype.addGlobalPropsConfigure({
        name: 'globalInsertProp3',
        position: 'top',
      });

      const proto3 = new Prototype(divPrototypeConfig);
      expect(proto3.getConfigure()[0].items).toHaveLength(3);
      expect(proto1.getConfigure()[0].items[0].name).toBe('globalInsertProp3');
    });

    it('removeGlobalPropsConfigure', () => {
      Prototype.removeGlobalPropsConfigure('globalInsertProp1');
      Prototype.removeGlobalPropsConfigure('globalInsertProp2');
      Prototype.removeGlobalPropsConfigure('globalInsertProp3');
      const proto2 = new Prototype(divPrototypeConfig);
      expect(proto2.getConfigure()[0].items).toHaveLength(2);
      expect(proto2.getConfigure()[2].items).toHaveLength(3);
    });

    it('overridePropsConfigure', () => {
      Prototype.addGlobalPropsConfigure({
        name: 'globalInsertProp1',
        title: 'globalInsertPropTitle',
        position: 'top',
      });
      const proto1 = new Prototype(divPrototypeConfig);
      expect(proto1.getConfigure()[0].items).toHaveLength(3);
      expect(proto1.getConfigure()[0].items[0].name).toBe('globalInsertProp1');
      expect(proto1.getConfigure()[0].items[0].title).toBe('globalInsertPropTitle');

      Prototype.overridePropsConfigure('Div', [
        {
          name: 'globalInsertProp1',
          title: 'globalInsertPropTitleChanged',
        },
      ]);
      const proto2 = new Prototype(divPrototypeConfig);
      expect(proto2.getConfigure()[0].name).toBe('globalInsertProp1');
      expect(proto2.getConfigure()[0].title).toBe('globalInsertPropTitleChanged');

      Prototype.overridePropsConfigure('Div', {
        globalInsertProp1: {
          name: 'globalInsertProp1',
          title: 'globalInsertPropTitleChanged new',
          position: 'top',
        },
      });
      const proto3 = new Prototype(divPrototypeConfig);
      expect(proto3.getConfigure()[0].items[0].name).toBe('globalInsertProp1');
      expect(proto3.getConfigure()[0].items[0].title).toBe('globalInsertPropTitleChanged new');
    });

    it('addGlobalExtraActions', () => {
      function haha() { return 'heihei'; }
      Prototype.addGlobalExtraActions(haha);
      const proto1 = new Prototype(divPrototypeConfig);
      expect(proto1.meta.availableActions).toHaveLength(4);
      expect(proto1.meta.availableActions[3].name).toBe('haha');
    });
  });
});
