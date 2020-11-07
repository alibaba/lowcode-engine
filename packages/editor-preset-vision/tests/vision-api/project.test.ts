import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import VisualEngine from '../../src';
import { Editor } from '@ali/lowcode-editor-core';

// import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';


describe.skip('VisualEngine.Project 相关 API 测试', () => {
  describe('getSchema / setSchema 系列', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      // console.log(VisualEngine);
      // console.log(Editor instanceof Function);
      // console.log(Editor.toString())
      // console.log(new Editor());
      // console.log(Editor2 instanceof Function);

      console.log(VisualEngine.Pages.addPage(formSchema));
    });
  });

  describe('setConfig 系列', () => {
    it('基本的节点模型初始化，模型导出，初始化传入 schema', () => {
      // console.log(VisualEngine);
      // console.log(Editor instanceof Function);
      // console.log(Editor.toString())
      // console.log(new Editor());
      // console.log(Editor2 instanceof Function);

      console.log(VisualEngine.Pages.addPage(formSchema));
    });
  });
});