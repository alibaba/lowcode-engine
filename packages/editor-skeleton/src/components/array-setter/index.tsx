import { Component, Fragment } from 'react';
import { Icon, Button, Message } from '@alifd/next';
import { Title } from '@ali/lowcode-editor-core';
import { SetterType, FieldConfig, SetterConfig } from '@ali/lowcode-types';
import { SettingField } from '@ali/lowcode-designer';
import { createSettingFieldView } from '../settings/settings-pane';
import { PopupContext, PopupPipe } from '../popup';
import Sortable from './sortable';
import './style.less';

interface ArraySetterState {
  items: SettingField[];
  itemsMap: Map<string | number, SettingField>;
}

interface ArraySetterProps {
  value: any[];
  field: SettingField;
  itemSetter?: SetterType;
  columns?: FieldConfig[];
  multiValue?: boolean;
  onChange?: Function;
}

export class ListSetter extends Component<ArraySetterProps, ArraySetterState> {
  state: ArraySetterState = {
    items: [],
    itemsMap: new Map<string | number, SettingField>(),
  };

  onItemChange = async () => {
    const { onChange } = this.props;
    const { items } = this.state;
    // setValue 的props数据合并会有一些延时，这里延时100毫秒来等待数据合并完成获取到最新数据
    await this.delay(100);
    onChange && onChange(items.map(item => {
      return item && item.getValue();
    }));
  };

  componentDidMount() {
    const { value, field, onChange } = this.props;
    const itemsMap = new Map<string | number, SettingField>();
    const items = [];
    const valueLength = value && Array.isArray(value) ? value.length : 0;

    for (let i = 0; i < valueLength; i++) {
      const item = field.createField({
        name: i,
        setter: this.props.itemSetter,
        forceInline: 1,
        setValue: this.onItemChange,
      });
      items[i] = item;
      itemsMap.set(item.id, item);
    }

    this.setState({
      items,
      itemsMap,
    }, () => {
      // setValue 会触发onItemChange，需要在items被设值之后才能调用
      value && value.map((item, index) => {
        items[index].setValue(item);
        return item;
      });
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onSort(sortedIds: Array<string | number>) {
    const { itemsMap } = this.state;
    const { onChange, itemSetter, field } = this.props;
    const sortValues = sortedIds.map((id) => {
      const value = itemsMap.get(id)!.getValue();
      return value;
    });

    // 对itemsMap重新生成并刷新当前setter数据
    const newItems: SettingField[] = [];
    // const newItemsMap = {};
    itemsMap.clear();
    for (let i = 0; i < sortValues.length; i++) {
      const newItem = field.createField({
        name: i,
        setter: itemSetter,
        // FIXME:
        forceInline: 1,
        setValue: this.onItemChange,
      });
      newItems[i] = newItem;

      itemsMap.set(newItem.id, newItem);
    }

    this.setState({
      items: newItems,
      itemsMap,
    }, () => {
      sortValues && sortValues.map((value, index) => {
        newItems[index].setValue(value);
        return newItems;
      });
    });
  }

  private scrollToLast = false;

  onAdd() {
    const { items, itemsMap } = this.state;
    const { itemSetter, onChange } = this.props;
    const initialValue = typeof itemSetter === 'object' ? (itemSetter as any).initialValue : null;
    const item = this.props.field.createField({
      name: items.length,
      setter: itemSetter,
      // FIXME:
      forceInline: 1,
      setValue: this.onItemChange,
    });
    items.push(item);
    itemsMap.set(item.id, item);
    this.scrollToLast = true;
    this.setState({
      items: items.slice(),
    }, () => {
      item.setValue(typeof initialValue === 'function' ? initialValue(item) : initialValue);
    });
  }

  onRemove(field: SettingField) {
    const { onChange } = this.props;
    const { items, itemsMap } = this.state;
    let i = items.indexOf(field);
    const values = items.map((item) => {
      return item.getValue();
    });
    if (i < 0) {
      return;
    }
    items.splice(i, 1);
    values.splice(i, 1);
    const l = items.length;
    while (i < l) {
      items[i].setKey(i);
      i++;
    }
    itemsMap.delete(field.id);
    field.remove();
    onChange && onChange(values);
    this.setState({ items: items.slice() });
  }

  componentWillUnmount() {
    this.state.items.forEach((field) => {
      field.purge();
    });
  }

  render() {
    let columns: any = null;
    if (this.props.columns) {
      columns = this.props.columns.map((column) => (
        <Title key={column.name} title={column.title || (column.name as string)} />
      ));
    }

    const { items } = this.state;
    const { scrollToLast } = this;
    this.scrollToLast = false;
    const lastIndex = items.length - 1;

    const content =
      items.length > 0 ? (
        <div className="lc-setter-list-scroll-body">
          <Sortable itemClassName="lc-setter-list-card" onSort={this.onSort.bind(this)}>
            {items.map((field, index) => (
              <ArrayItem
                key={field.id}
                scrollIntoView={scrollToLast && index === lastIndex}
                field={field}
                onRemove={this.onRemove.bind(this, field)}
              />
            ))}
          </Sortable>
        </div>
      ) : this.props.multiValue ? (<Message type="warning">当前选择了多个节点，且值不一致，修改会覆盖所有值</Message>) : (<Message type="notice">当前项目为空</Message>);

    return (
      <div className="lc-setter-list lc-block-setter">
        {/* <div className="lc-block-setter-actions">
          <Button size="medium" onClick={this.onAdd.bind(this)}>
            <Icon type="add" />
            <span>添加</span>
          </Button>
        </div> */}
        {columns && <div className="lc-setter-list-columns">{columns}</div>}
        {content}
        <Button className="lc-setter-list-add" type="primary" onClick={this.onAdd.bind(this)}>
          <Icon type="add" />
          <span>添加一项</span>
        </Button>
      </div>
    );
  }
}

class ArrayItem extends Component<{
  field: SettingField;
  onRemove: () => void;
  scrollIntoView: boolean;
}> {
  shouldComponentUpdate() {
    return false;
  }

  private shell?: HTMLDivElement | null;

  componentDidMount() {
    if (this.props.scrollIntoView && this.shell) {
      this.shell.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  render() {
    const { onRemove, field } = this.props;
    return (
      <div className="lc-listitem" ref={(ref) => { this.shell = ref; }}>
        <div draggable className="lc-listitem-handler">
          <Icon type="ellipsis" size="small" />
        </div>
        <div className="lc-listitem-body">{createSettingFieldView(field, field.parent)}</div>
        <div className="lc-listitem-actions">
          <div className="lc-listitem-action" onClick={onRemove}>
            <Icon type="ashbin" size="small" />
          </div>
        </div>
      </div>
    );
  }
}

class TableSetter extends ListSetter {
  // todo:
  // forceInline = 1
  // has more actions
}

export default class ArraySetter extends Component<{
  value: any[];
  field: SettingField;
  itemSetter?: SetterType;
  mode?: 'popup' | 'list';
  forceInline?: boolean;
  multiValue?: boolean;
}> {
  static contextType = PopupContext;

  private pipe: any;

  render() {
    const { mode, forceInline, ...props } = this.props;
    const { field, itemSetter } = props;
    let columns: FieldConfig[] | undefined;
    if ((itemSetter as SetterConfig)?.componentName === 'ObjectSetter') {
      const items: FieldConfig[] = (itemSetter as any).props?.config?.items;
      if (items && Array.isArray(items)) {
        columns = items.filter((item) => item.isRequired || item.important || (item.setter as any)?.isRequired);
        if (columns.length > 4) {
          columns = columns.slice(0, 4);
        }
      }
    }

    if (mode === 'popup' || forceInline) {
      const title = (
        <Fragment>
          编辑：
          <Title title={field.title} />
        </Fragment>
      );
      if (!this.pipe) {
        let width = 360;
        if (columns) {
          if (columns.length === 3) {
            width = 480;
          } else if (columns.length > 3) {
            width = 600;
          }
        }
        this.pipe = (this.context as PopupPipe).create({ width });
      }

      this.pipe.send(<TableSetter key={field.id} {...props} columns={columns} />, title);
      return (
        <Button
          type={forceInline ? 'normal' : 'primary'}
          onClick={(e) => {
            this.pipe.show((e as any).target, field.id);
          }}
        >
          <Icon type="edit" />
          {forceInline ? title : '编辑数组'}
        </Button>
      );
    } else {
      return <ListSetter {...props} columns={columns?.slice(0, 2)} />;
    }
  }
}
