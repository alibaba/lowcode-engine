import React from 'react';
import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { Node } from '../../src/document/node/node';
import TestRenderer from 'react-test-renderer';
import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';
import { BuiltinSimulatorHostView } from '../../src/builtin-simulator/host-view';

configure({ adapter: new Adapter() });
const editor = new Editor();

describe('host-view 测试', () => {
  let designer: Designer;
  beforeEach(() => {
    designer = new Designer({ editor });
  });
  afterEach(() => {
    designer._componentMetasMap.clear();
    designer = null;
  });

  it('host-view', () => {
    const hostView = render(<BuiltinSimulatorHostView project={designer.project} />);
  })
});
