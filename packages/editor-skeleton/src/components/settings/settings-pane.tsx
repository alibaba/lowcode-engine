import { Component, MouseEvent, Fragment } from 'react';
import { shallowIntl, createSetterContent, observer, obx, engineConfig, runInAction, globalContext } from '@alilc/lowcode-editor-core';
import { createContent } from '@alilc/lowcode-utils';
import { Skeleton } from '@alilc/lowcode-editor-skeleton';
import { isSetterConfig, CustomView, isJSSlot } from '@alilc/lowcode-types';
import { SettingField, isSettingField, SettingTopEntry, SettingEntry, ComponentMeta } from '@alilc/lowcode-designer';
import { createField } from '../field';
import PopupService, { PopupPipe } from '../popup';
import { SkeletonContext } from '../../context';
// import { Icon } from '@alifd/next';
import { intl } from '../../locale';

function transformStringToFunction(str) {
  if (typeof str !== 'string') return str;
  // eslint-disable-next-line no-new-func
  return new Function(`"use strict"; return ${str}`)();
}

function isStandardComponent(componentMeta: ComponentMeta | null) {
  if (!componentMeta) return false;
  const { prototype } = componentMeta;
  return prototype == null;
}

/**
 * 判断 initialValue 是否为非空，非空条件：
 *  1. 当为 slot 结构时，value 为有长度的数组且 visible 不为 false
 *  2. 不为 slot 结构，为非 undefined / null 值
 * @param initialValue
 * @returns
 */
function isInitialValueNotEmpty(initialValue: any) {
  if (isJSSlot(initialValue)) {
    // @ts-ignore visible 为 false 代表默认不展示
    return initialValue.visible !== false && Array.isArray(initialValue.value) && initialValue.value.length > 0;
  }
  return (initialValue !== undefined && initialValue !== null);
}

type SettingFieldViewProps = { field: SettingField };
@observer
class SettingFieldView extends Component<{ field: SettingField }> {
  static contextType = SkeletonContext;

  stageName: string | undefined;

  constructor(props: SettingFieldViewProps) {
    super(props);

    const { field } = this.props;
    const { extraProps } = field;
    const { display } = extraProps;

    const editor = globalContext.get('editor');
    const { stages } = editor.get('skeleton') as Skeleton;
    let stageName;
    if (display === 'entry') {
      runInAction(() => {
        stageName = `${field.getNode().id}_${field.name.toString()}`;
        // 清除原 stage，不然 content 引用的一直是老的 field，导致数据无法得到更新
        stages.container.remove(stageName);
        const stage = stages.add({
          type: 'Widget',
          name: stageName,
          content: <Fragment>{field.items.map((item, index) => createSettingFieldView(item, field, index))}</Fragment>,
          props: {
            title: field.title,
          },
        });
      });
    }
    this.stageName = stageName;
  }

  render() {
    const { field } = this.props;
    const { extraProps, componentMeta } = field;
    const { condition, defaultValue } = extraProps;
    let visible;
    try {
      visible = typeof condition === 'function' ? condition(field.internalToShellPropEntry()) !== false : true;
    } catch (error) {
      console.error('exception when condition (hidden) is excuted', error);
    }

    if (!visible) {
      return null;
    }
    const { setter } = field;

    let setterProps: any = {};
    let setterType: any;
    let initialValue: any = null;

    if (Array.isArray(setter)) {
      setterType = 'MixedSetter';
      setterProps = {
        setters: setter,
      };
    } else if (isSetterConfig(setter)) {
      setterType = setter.componentName;
      if (setter.props) {
        setterProps = setter.props;
        if (typeof setterProps === 'function') {
          setterProps = setterProps(field.internalToShellPropEntry());
        }
      }
      if (setter.initialValue != null) {
        initialValue = setter.initialValue;
      }
    } else if (setter) {
      setterType = setter;
    }

    // 根据是否支持变量配置做相应的更改
    const supportVariable = field.extraProps?.supportVariable;
    // supportVariableGlobally 只对标准组件生效，vc 需要单独配置
    const supportVariableGlobally = engineConfig.get('supportVariableGlobally', false) && isStandardComponent(componentMeta);
    if (supportVariable || supportVariableGlobally) {
      if (setterType === 'MixedSetter') {
        if (!setterProps.setters.includes('VariableSetter')) {
          setterProps.setters.push('VariableSetter');
        }
      } else {
        setterType = 'MixedSetter';
        setterProps = {
          setters: [
            setter,
            'VariableSetter',
          ],
        };
      }
    }

    let value = null;
    if (defaultValue != null && !('defaultValue' in setterProps)) {
      setterProps.defaultValue = defaultValue;
      if (initialValue == null) {
        initialValue = defaultValue;
      }
    }
    if (field.valueState === -1) {
      setterProps.multiValue = true;
      if (!('placeholder' in setterProps)) {
        setterProps.placeholder = intl('Multiple Value');
      }
    } else {
      value = field.getValue();
    }

    // 当前 field 没有 value 值时，将 initialValue 写入 field
    // 之所以用 initialValue，而不是 defaultValue 是为了保持跟 props.onInitial 的逻辑一致
    if (value === undefined && isInitialValueNotEmpty(initialValue)) {
      const _initialValue = typeof initialValue === 'function' ? initialValue(field.internalToShellPropEntry()) : initialValue;
      field.setValue(_initialValue);
      value = _initialValue;
    }

    let _onChange = extraProps?.onChange;
    let stageName = this.stageName;

    return createField(
      {
        meta: field?.componentMeta?.npm || field?.componentMeta?.componentName || '',
        title: field.title,
        // editor: field.editor,
        collapsed: !field.expanded,
        valueState: field.isRequired ? 10 : field.valueState,
        onExpandChange: (expandState) => field.setExpanded(expandState),
        onClear: () => field.clearValue(),
        // field: field,
        // stages,
        stageName,
        ...extraProps,
      },
      !stageName &&
      createSetterContent(setterType, {
        ...shallowIntl(setterProps),
        forceInline: extraProps.forceInline,
        key: field.id,
        // === injection
        prop: field.internalToShellPropEntry(), // for compatible vision
        selected: field.top?.getNode()?.internalToShellNode(),
        field: field.internalToShellPropEntry(),
        // === IO
        value, // reaction point
        onChange: (value: any) => {
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            value,
          });
          field.setValue(value);
          if (_onChange) _onChange(value, field);
        },
        onInitial: () => {
          if (initialValue == null) {
            return;
          }
          const value = typeof initialValue === 'function' ? initialValue(field.internalToShellPropEntry()) : initialValue;
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            value,
          });
          field.setValue(value);
        },

        removeProp: () => {
          field.parent.clearPropValue(field.name);
        },
      }),
      extraProps.forceInline ? 'plain' : extraProps.display,
    );
  }
}

type SettingGroupViewProps = SettingFieldViewProps;
@observer
class SettingGroupView extends Component<SettingGroupViewProps> {
  static contextType = SkeletonContext;

  stageName: string | undefined;

  constructor(props: SettingGroupViewProps) {
    super(props);
    const { field } = this.props;
    const { extraProps } = field;
    const { display } = extraProps;
    const editor = globalContext.get('editor');
    const { stages } = editor.get('skeleton') as Skeleton;
    // const items = field.items;

    let stageName;
    if (display === 'entry') {
      runInAction(() => {
        stageName = `${field.getNode().id}_${field.name.toString()}`;
        // 清除原 stage，不然 content 引用的一直是老的 field，导致数据无法得到更新
        stages.container.remove(stageName);
        stages.add({
          type: 'Widget',
          name: stageName,
          content: <Fragment>{field.items.map((item, index) => createSettingFieldView(item, field, index))}</Fragment>,
          props: {
            title: field.title,
          },
        });
      });
    }
    this.stageName = stageName;
  }

  render() {
    const { field } = this.props;
    const { extraProps } = field;
    const { condition, display } = extraProps;
    const visible = field.isSingle && typeof condition === 'function' ? condition(field.internalToShellPropEntry()) !== false : true;

    if (!visible) {
      return null;
    }

    // todo: split collapsed state | field.items for optimize
    return createField(
      {
        meta: field.componentMeta?.npm || field.componentMeta?.componentName || '',
        title: field.title,
        // editor: field.editor,
        collapsed: !field.expanded,
        onExpandChange: (expandState) => field.setExpanded(expandState),
        // field: field,
        // stages,
        stageName: this.stageName,
      },
      field.items.map((item, index) => createSettingFieldView(item, field, index)),
      display,
    );
  }
}

export function createSettingFieldView(item: SettingField | CustomView, field: SettingEntry, index?: number) {
  if (isSettingField(item)) {
    if (item.isGroup) {
      return <SettingGroupView field={item} key={item.id} />;
    } else {
      return <SettingFieldView field={item} key={item.id} />;
    }
  } else {
    return createContent(item, { key: index, field });
  }
}

export type SettingsPaneProps = {
  target: SettingTopEntry | SettingField;
  usePopup?: boolean;
};

@observer
export class SettingsPane extends Component<SettingsPaneProps> {
  static contextType = SkeletonContext;

  @obx private currentStage?: Stage;

  private popupPipe = new PopupPipe();

  private pipe = this.popupPipe.create();

  private handleClick = (e: MouseEvent) => {
    // compatiable vision stageBox
    // TODO: optimize these codes
    const { usePopup = true } = this.props;
    if (!usePopup) return;
    const pane = e.currentTarget as HTMLDivElement;
    function getTarget(node: any): any {
      if (!pane.contains(node) || (node.nodeName === 'A' && node.getAttribute('href'))) {
        return null;
      }

      const target = node.dataset ? node.dataset.stageTarget : null;
      if (target) {
        return target;
      }
      return getTarget(node.parentNode);
    }
    const target = getTarget(e.target);
    if (!target) {
      return;
    }

    const skeleton = this.context as Skeleton;
    if (!skeleton || !skeleton.stages) {
      return;
    }
    const stage = skeleton.stages.container.get(target);
    if (stage) {
      if (this.currentStage) {
        stage.setPrevious(this.currentStage);
      }
      this.currentStage = stage;
    }
  };

  private popStage() {
    this.currentStage = this.currentStage?.getPrevious();
  }

  render() {
    const { target } = this.props;
    const { items } = target;

    return (
      <div className="lc-settings-pane" onClick={this.handleClick}>
        {/* todo: add head for single use */}
        <PopupService popupPipe={this.popupPipe}>
          <div className="lc-settings-content">
            {items.map((item, index) => createSettingFieldView(item, target, index))}
          </div>
        </PopupService>
      </div>
    );
  }
}
