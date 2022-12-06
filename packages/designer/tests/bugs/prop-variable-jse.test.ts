// @ts-nocheck
import { Editor } from '@alilc/lowcode-editor-core';
import { TransformStage } from '@alilc/lowcode-types';
import { isPlainObject, isVariable, isJSBlock } from '@alilc/lowcode-utils';
import '../fixtures/window';
import { Designer } from '../../src/designer/designer';
import { DocumentModel } from '../../src/document/document-model';
import { Project } from '../../src/project/project';
import formSchema from '../fixtures/schema/form';

/**
 * bug 背景：
 * Prop 在每次 setValue 时都会调用 dispose 方法用于重新计算子 Prop，我认为在 Node 未完成初始化之前的 dispose 都是
 * 无意义的，所以增加了判断条件来调用 dispose，结果导致了 variable 结果没有正确转成 JSExpression 结构。
 *
 * 因为 propsReducer 的 Init / Upgrade 阶段依然可以更改 props，且此时的 Node 也未完成初始化，不调用 dispose 则导致新的 Prop 结构无法生效
 */

function upgradePropsReducer(props: any): any {
  if (!props || !isPlainObject(props)) {
    return props;
  }

  if (isJSBlock(props)) {
    if (props.value.componentName === 'Slot') {
      return {
        type: 'JSSlot',
        title: (props.value.props as any)?.slotTitle,
        name: (props.value.props as any)?.slotName,
        value: props.value.children,
      };
    } else {
      return props.value;
    }
  }
  if (isVariable(props)) {
    return {
      type: 'JSExpression',
      value: props.variable,
      mock: props.value,
    };
  }
  const newProps: any = {};
  Object.keys(props).forEach((key) => {
    if (/^__slot__/.test(key) && props[key] === true) {
      return;
    }
    newProps[key] = upgradePropsReducer(props[key]);
  });
  return newProps;
}

describe('Node 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  let project: Project;
  let doc: DocumentModel;

  it('原始 prop 值是 variable 结构，通过一个 propsReducer 转成了 JSExpression 结构', () => {
    editor = new Editor();
    designer = new Designer({ editor });
    designer.addPropsReducer(upgradePropsReducer, TransformStage.Upgrade);
    project = designer.project;
    doc = new DocumentModel(project, formSchema);

    const form = doc.getNode('form');
    expect(form.getPropValue('dataSource')).toEqual({
      type: 'JSExpression',
      value: 'state.formData',
    })
  });
});
