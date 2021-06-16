import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Project } from '../../../src/project/project';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import { getIdsFromSchema, getNodeFromSchemaById } from '../../utils';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../../src/designer/designer', () => {
  return {
    Designer: jest.fn().mockImplementation(() => {
      return {
        getComponentMeta() {
          return {
            getMetadata() {
              return { experimental: null };
            },
          };
        },
        transformProps(props) { return props; },
        createSettingEntry: mockCreateSettingEntry,
        postEvent() {},
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
});

describe('schema 生成节点模型测试', () => {
  describe('block ❌ | component ❌ | slot ❌', () => {
    let project: Project;
    beforeEach(() => {
      project = new Project(designer, {
        componentsTree: [
          formSchema,
        ],
      });
      project.open();
    });
    it('读取普通属性，string | number | object', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');
      /*
        props: {
          size: 'medium',
          labelAlign: 'top',
          autoValidate: true,
          scrollToFirstError: true,
          autoUnmount: true,
          behavior: 'NORMAL',
          dataSource: {
            type: 'variable',
            variable: 'state.formData',
          },
          obj: {
            a: 1,
            b: false,
            c: 'string',
          },
          __style__: {},
          fieldId: 'form',
          fieldOptions: {},
        },
        id: 'form',
        condition: true,
      */
      const sizeProp = formNode?.getProp('size');
      const sizeProp2 = formNode?.getProps().getProp('size');
      expect(sizeProp).toBe(sizeProp2);
      expect(sizeProp?.getAsString()).toBe('medium');
      expect(sizeProp?.getValue()).toBe('medium');

      const autoValidateProp = formNode?.getProp('autoValidate');
      expect(autoValidateProp?.getValue()).toBe(true);

      const objProp = formNode?.getProp('obj');
      expect(objProp?.getValue()).toEqual({
        a: 1,
        b: false,
        c: 'string',
      });
      const objAProp = formNode?.getProp('obj.a');
      const objBProp = formNode?.getProp('obj.b');
      const objCProp = formNode?.getProp('obj.c');
      expect(objAProp?.getValue()).toBe(1);
      expect(objBProp?.getValue()).toBe(false);
      expect(objCProp?.getValue()).toBe('string');

      const idProp = formNode?.getExtraProp('extraPropA');
      expect(idProp?.getValue()).toBe('extraPropA');
    });

    it('修改普通属性，string | number | object，使用 Node 实例接口', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');
      /*
        props: {
          size: 'medium',
          labelAlign: 'top',
          autoValidate: true,
          scrollToFirstError: true,
          autoUnmount: true,
          behavior: 'NORMAL',
          dataSource: {
            type: 'variable',
            variable: 'state.formData',
          },
          obj: {
            a: 1,
            b: false,
            c: 'string',
          },
          __style__: {},
          fieldId: 'form',
          fieldOptions: {},
        },
        id: 'form',
        condition: true,
      */
      formNode?.setPropValue('size', 'large');
      const sizeProp = formNode?.getProp('size');
      expect(sizeProp?.getAsString()).toBe('large');
      expect(sizeProp?.getValue()).toBe('large');

      formNode?.setPropValue('autoValidate', false);
      const autoValidateProp = formNode?.getProp('autoValidate');
      expect(autoValidateProp?.getValue()).toBe(false);

      formNode?.setPropValue('obj', {
        a: 2,
        b: true,
        c: 'another string',
      });
      const objProp = formNode?.getProp('obj');
      expect(objProp?.getValue()).toEqual({
        a: 2,
        b: true,
        c: 'another string',
      });
      formNode?.setPropValue('obj.a', 3);
      formNode?.setPropValue('obj.b', false);
      formNode?.setPropValue('obj.c', 'string');
      const objAProp = formNode?.getProp('obj.a');
      const objBProp = formNode?.getProp('obj.b');
      const objCProp = formNode?.getProp('obj.c');
      expect(objAProp?.getValue()).toBe(3);
      expect(objBProp?.getValue()).toBe(false);
      expect(objCProp?.getValue()).toBe('string');
      expect(objProp?.getValue()).toEqual({
        a: 3,
        b: false,
        c: 'string',
      });
    });

    it('修改普通属性，string | number | object，使用 Props 实例接口', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');
      /*
        props: {
          size: 'medium',
          labelAlign: 'top',
          autoValidate: true,
          scrollToFirstError: true,
          autoUnmount: true,
          behavior: 'NORMAL',
          dataSource: {
            type: 'variable',
            variable: 'state.formData',
          },
          obj: {
            a: 1,
            b: false,
            c: 'string',
          },
          __style__: {},
          fieldId: 'form',
          fieldOptions: {},
        },
        id: 'form',
        condition: true,
      */
      const props = formNode?.getProps();
      props?.setPropValue('size', 'large');
      const sizeProp = formNode?.getProp('size');
      expect(sizeProp?.getAsString()).toBe('large');
      expect(sizeProp?.getValue()).toBe('large');

      props?.setPropValue('autoValidate', false);
      const autoValidateProp = formNode?.getProp('autoValidate');
      expect(autoValidateProp?.getValue()).toBe(false);

      props?.setPropValue('obj', {
        a: 2,
        b: true,
        c: 'another string',
      });
      const objProp = formNode?.getProp('obj');
      expect(objProp?.getValue()).toEqual({
        a: 2,
        b: true,
        c: 'another string',
      });
      props?.setPropValue('obj.a', 3);
      props?.setPropValue('obj.b', false);
      props?.setPropValue('obj.c', 'string');
      const objAProp = formNode?.getProp('obj.a');
      const objBProp = formNode?.getProp('obj.b');
      const objCProp = formNode?.getProp('obj.c');
      expect(objAProp?.getValue()).toBe(3);
      expect(objBProp?.getValue()).toBe(false);
      expect(objCProp?.getValue()).toBe('string');
      expect(objProp?.getValue()).toEqual({
        a: 3,
        b: false,
        c: 'string',
      });
    });

    it('修改普通属性，string | number | object，使用 Prop 实例接口', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');
      /*
        props: {
          size: 'medium',
          labelAlign: 'top',
          autoValidate: true,
          scrollToFirstError: true,
          autoUnmount: true,
          behavior: 'NORMAL',
          dataSource: {
            type: 'variable',
            variable: 'state.formData',
          },
          obj: {
            a: 1,
            b: false,
            c: 'string',
          },
          __style__: {},
          fieldId: 'form',
          fieldOptions: {},
        },
        id: 'form',
        condition: true,
      */
      const sizeProp = formNode?.getProp('size');
     sizeProp?.setValue('large');
     expect(sizeProp?.getAsString()).toBe('large');
     expect(sizeProp?.getValue()).toBe('large');

     const autoValidateProp = formNode?.getProp('autoValidate');
     autoValidateProp?.setValue(false);
     expect(autoValidateProp?.getValue()).toBe(false);


     const objProp = formNode?.getProp('obj');
     objProp?.setValue({
       a: 2,
       b: true,
       c: 'another string',
     });
     expect(objProp?.getValue()).toEqual({
       a: 2,
       b: true,
       c: 'another string',
     });
     const objAProp = formNode?.getProp('obj.a');
     const objBProp = formNode?.getProp('obj.b');
     const objCProp = formNode?.getProp('obj.c');
     objAProp?.setValue(3);
     objBProp?.setValue(false);
     objCProp?.setValue('string');
     expect(objAProp?.getValue()).toBe(3);
     expect(objBProp?.getValue()).toBe(false);
     expect(objCProp?.getValue()).toBe('string');
     expect(objProp?.getValue()).toEqual({
       a: 3,
       b: false,
       c: 'string',
     });
    });
  });

  describe('block ❌ | component ❌ | slot ✅', () => {
    let project: Project;
    beforeEach(() => {
      project = new Project(designer, {
        componentsTree: [
          formSchema,
        ],
      });
      project.open();
    });
    it('修改 slot 属性，初始存在 slot 属性名，正常生成节点模型', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');

      formNode?.setPropValue('slotA', {
        type: 'JSSlot',
        value: [{
          componentName: 'TextInput1',
          props: {
            txt: 'haha',
            num: 1,
            bool: true,
          },
        }, {
          componentName: 'TextInput2',
          props: {
            txt: 'heihei',
            num: 2,
            bool: false,
          },
        }],
      });

      expect(nodesMap.size).toBe(ids.length + 3);
      expect(formNode?.slots).toHaveLength(1);
      expect(formNode?.slots[0].children).toHaveLength(2);
      const firstChildNode = formNode?.slots[0].children?.get(0);
      const secondChildNode = formNode?.slots[0].children?.get(1);
      expect(firstChildNode?.componentName).toBe('TextInput1');
      expect(firstChildNode?.getPropValue('txt')).toBe('haha');
      expect(firstChildNode?.getPropValue('num')).toBe(1);
      expect(firstChildNode?.getPropValue('bool')).toBe(true);
      expect(secondChildNode?.componentName).toBe('TextInput2');
      expect(secondChildNode?.getPropValue('txt')).toBe('heihei');
      expect(secondChildNode?.getPropValue('num')).toBe(2);
      expect(secondChildNode?.getPropValue('bool')).toBe(false);
    });

    it('修改 slot 属性，初始存在 slot 属性名，关闭 slot', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');

      formNode?.setPropValue('slotA', {
        type: 'JSSlot',
        value: [{
          componentName: 'TextInput1',
          props: {
            txt: 'haha',
            num: 1,
            bool: true,
          },
        }, {
          componentName: 'TextInput2',
          props: {
            txt: 'heihei',
            num: 2,
            bool: false,
          },
        }],
      });

      expect(nodesMap.size).toBe(ids.length + 3);
      expect(formNode?.slots).toHaveLength(1);

      formNode?.setPropValue('slotA', '');

      expect(nodesMap.size).toBe(ids.length);
      expect(formNode?.slots).toHaveLength(0);
    });

    it('修改 slot 属性，初始存在 slot 属性名，同名覆盖 slot', () => {
      expect(project).toBeTruthy();
      const { currentDocument } = project;
      const { nodesMap } = currentDocument;
      const ids = getIdsFromSchema(formSchema);
      const expectedNodeCnt = ids.length;
      const formNode = currentDocument?.getNode('form');

      formNode?.setPropValue('slotA', {
        type: 'JSSlot',
        name: 'slotA',
        value: [{
          componentName: 'TextInput1',
          props: {
            txt: 'haha',
            num: 1,
            bool: true,
          },
        }, {
          componentName: 'TextInput2',
          props: {
            txt: 'heihei',
            num: 2,
            bool: false,
          },
        }],
      });

      expect(nodesMap.size).toBe(ids.length + 3);
      expect(formNode?.slots).toHaveLength(1);
      expect(formNode?.slots[0].children).toHaveLength(2);

      let firstChildNode = formNode?.slots[0].children?.get(0);
      expect(firstChildNode?.componentName).toBe('TextInput1');
      expect(firstChildNode?.getPropValue('txt')).toBe('haha');
      expect(firstChildNode?.getPropValue('num')).toBe(1);
      expect(firstChildNode?.getPropValue('bool')).toBe(true);

      formNode?.setPropValue('slotA', {
        type: 'JSSlot',
        name: 'slotA',
        value: [{
          componentName: 'TextInput3',
          props: {
            txt: 'xixi',
            num: 3,
            bool: false,
          },
        }],
      });

      expect(nodesMap.size).toBe(ids.length + 2);
      expect(formNode?.slots).toHaveLength(1);
      expect(formNode?.slots[0].children).toHaveLength(1);
      firstChildNode = formNode?.slots[0].children?.get(0);
      expect(firstChildNode?.componentName).toBe('TextInput3');
      expect(firstChildNode?.getPropValue('txt')).toBe('xixi');
      expect(firstChildNode?.getPropValue('num')).toBe(3);
      expect(firstChildNode?.getPropValue('bool')).toBe(false);
    });
  });
});
