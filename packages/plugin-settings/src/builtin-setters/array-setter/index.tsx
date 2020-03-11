import { Component } from 'react';
import { Icon, Button, Message } from '@alifd/next';
import Sortable from './sortable';
import { SettingField, SetterType } from '../../main';
import './style.less';
import { createSettingFieldView } from '../../settings-pane';

interface ArraySetterState {
  items: SettingField[];
  itemsMap: Map<string | number, SettingField>;
  prevLength: number;
}

interface ArraySetterProps {
  value: any[];
  field: SettingField;
  itemConfig?: {
    setter?: SetterType;
    defaultValue?: any | ((field: SettingField) => any);
    required?: boolean;
  };
  multiValue?: boolean;
}

export class ListSetter extends Component<ArraySetterProps, ArraySetterState> {
  static getDerivedStateFromProps(props: ArraySetterProps, state: ArraySetterState) {
    const { value, field } = props;
    const newLength = value && Array.isArray(value) ? value.length : 0;
    if (state && state.prevLength === newLength) {
      return null;
    }

    // props value length change will go here
    const originLength = state ? state.items.length : 0;
    if (state && originLength === newLength) {
      return {
        prevLength: newLength,
      };
    }

    const itemsMap = state ? state.itemsMap : new Map<string | number, SettingField>();
    let items = state ? state.items.slice() : [];
    if (newLength > originLength) {
      for (let i = originLength; i < newLength; i++) {
        const item = field.createField({
          ...props.itemConfig,
          name: i,
          forceInline: 1,
        });
        items[i] = item;
        itemsMap.set(item.id, item);
      }
    } else if (newLength < originLength) {
      const deletes = items.splice(newLength);
      deletes.forEach(item => {
        itemsMap.delete(item.id);
      });
    }
    return {
      items,
      itemsMap,
      prevLength: newLength,
    };
  }

  state: ArraySetterState = {
    items: [],
    itemsMap: new Map<string | number, SettingField>(),
    prevLength: 0,
  };

  onSort(sortedIds: Array<string | number>) {
    const { itemsMap } = this.state;
    const items = sortedIds.map((id, index) => {
      const item = itemsMap.get(id)!;
      item.setKey(index);
      return item;
    });
    this.setState({
      items,
    });
  }

  private scrollToLast: boolean = false;
  onAdd() {
    const { items, itemsMap } = this.state;
    const { itemConfig } = this.props;
    const defaultValue = itemConfig ? itemConfig.defaultValue : null;
    const item = this.props.field.createField({
      ...itemConfig,
      name: items.length,
      forceInline: 1,
    });
    items.push(item);
    itemsMap.set(item.id, item);
    item.setValue(typeof defaultValue === 'function' ? defaultValue(item) : defaultValue);
    this.scrollToLast = true;
    this.setState({
      items: items.slice(),
    });
  }

  onRemove(field: SettingField) {
    const { items } = this.state;
    let i = items.indexOf(field);
    if (i < 0) {
      return;
    }
    items.splice(i, 1);
    const l = items.length;
    while (i < l) {
      items[i].setKey(i);
      i++;
    }
    field.remove();
    this.setState({ items: items.slice() });
  }

  componentWillUnmount() {
    this.state.items.forEach(field => {
      field.purge();
    });
  }

  shouldComponentUpdate(_: any, nextState: ArraySetterState) {
    if (nextState.items !== this.state.items) {
      return true;
    }
    return false;
  }

  render() {
    // mini Button: depends popup
    if (this.props.itemConfig) {
      // check is ObjectSetter then check if show columns
    }

    const { items } = this.state;
    const scrollToLast = this.scrollToLast;
    this.scrollToLast = false;
    const lastIndex = items.length - 1;

    return (
      <div className="lc-setter-list lc-block-setter">
        <div className="lc-block-setter-actions">
          <Button size="medium" onClick={this.onAdd.bind(this)}>
            <Icon type="add" />
            <span>添加</span>
          </Button>
        </div>
        {this.props.multiValue && <Message type="warning">当前选择多个节点，且值不一致</Message>}
        {items.length > 0 ? (
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
        ) : (
          <div className="lc-setter-list-empty">
            列表为空
            <Button size="small" onClick={this.onAdd.bind(this)}>
              <Icon type="add" />
              <span>添加</span>
            </Button>
          </div>
        )}
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
      <div className="lc-listitem" ref={ref => (this.shell = ref)}>
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

class TableSetter extends ListSetter {}

export default class ArraySetter extends Component<{
  value: any[];
  field: SettingField;
  itemConfig?: {
    setter?: SetterType;
    defaultValue?: any | ((field: SettingField) => any);
    required?: boolean;
  };
  mode?: 'popup' | 'list' | 'table';
  forceInline?: boolean;
  multiValue?: boolean;
}> {
  render() {
    const { mode, forceInline, ...props } = this.props;
    if (mode === 'popup' || forceInline) {
      // todo popup
      return <Button>编辑数组</Button>;
    } else if (mode === 'table') {
      return <TableSetter {...props} />;
    } else {
      return <ListSetter {...props} />;
    }
  }
}
