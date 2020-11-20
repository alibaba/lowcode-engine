import React from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';
import { BuiltinSimulatorHost } from '../../src/builtin-simulator/host';


const editor = new Editor();

describe('setting-prop-entry 测试', () => {
  let designer: Designer;
  beforeEach(() => {
    designer = new Designer({ editor });
  });
  afterEach(() => {
    designer._componentMetasMap.clear();
    designer = null;
  });

  it('dummy test', () => {
    console.log(new BuiltinSimulatorHost(designer.project));
  })
});
