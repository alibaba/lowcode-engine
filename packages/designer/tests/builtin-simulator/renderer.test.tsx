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
import { getMockRenderer } from '../utils';
import { isSimulatorRenderer } from '../../src/builtin-simulator/renderer';


describe('renderer 测试', () => {
  it('renderer', () => {
    expect(isSimulatorRenderer(getMockRenderer())).toBeTruthy;
  })
});
