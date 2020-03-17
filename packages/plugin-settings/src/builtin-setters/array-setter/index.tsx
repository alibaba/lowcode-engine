import { Component, Fragment } from 'react';
import { Icon, Button, Message } from '@alifd/next';
import Sortable from './sortable';
import { SettingField, SetterType, FieldConfig, SetterConfig } from '../../main';
import './style.less';
import { createSettingFieldView } from '../../settings-pane';
import { PopupContext, PopupPipe } from '../../popup';
import Title from '../../title';

interface ArraySetterState {
  items: SettingField[];
  itemsMap: Map<string | number, SettingField>;
  prevLength: number;
}

interface ArraySetterProps {
  value: any[];
  field: SettingField;
  itemSetter?: SetterType;
  columns?: FieldConfig[];
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
          name: i,
          setter: props.itemSetter,
          // FIXME:
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
    const { itemSetter } = this.props;
    const initialValue = typeof itemSetter === 'object' ? (itemSetter as any).initialValue : null;
    const item = this.props.field.createField({
      name: items.length,
      setter: itemSetter,
      // FIXME:
      forceInline: 1,
    });
    items.push(item);
    itemsMap.set(item.id, item);
    item.setValue(typeof initialValue === 'function' ? initialValue(item) : initialValue);
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
    let columns: any = null;
    if (this.props.columns) {
      columns = this.props.columns.map(column => <Title title={column.title || (column.name as string)} />);
    }

    const { items } = this.state;
    const scrollToLast = this.scrollToLast;
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
      ) : this.props.multiValue ? (
        <Message type="warning">当前选择了多个节点，且值不一致，修改会覆盖所有值</Message>
      ) : (
        <Message type="notice">当前项目为空</Message>
      );

    return (
      <div className="lc-setter-list lc-block-setter">
        {/*<div className="lc-block-setter-actions">
          <Button size="medium" onClick={this.onAdd.bind(this)}>
            <Icon type="add" />
            <span>添加</span>
          </Button>
        </div>*/}
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
        columns = items.filter(item => item.isRequired || item.important || (item.setter as any)?.isRequired);
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
          onClick={e => {
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
