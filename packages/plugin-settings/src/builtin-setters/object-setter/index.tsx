import { Component, Fragment } from 'react';
import { Icon, Button } from '@alifd/next';
import { FieldConfig, SettingField, SetterType } from '../../main';
import { createSettingFieldView } from '../../settings-pane';
import { PopupContext, PopupPipe } from '../../popup';
import Title from '../../title';
import './style.less';

export default class ObjectSetter extends Component<{
  field: SettingField;
  descriptor?: string | ((rowField: SettingField) => string);
  config: ObjectSetterConfig;
  mode?: 'popup' | 'form';
  // 1: in tablerow  2: in listrow 3: in column-cell
  forceInline?: number;
}> {
  render() {
    const { mode, forceInline = 0, ...props } = this.props;
    if (forceInline || mode === 'popup') {
      if (forceInline > 2 || mode === 'popup') {
        // popup
        return <RowSetter {...props} primaryButton={forceInline ? false : true} />;
      } else {
        return <RowSetter columns={forceInline > 1 ? 2 : 4} {...props} />;
      }
    } else {
      // form
      return <FormSetter />;
    }
  }
}

interface ObjectSetterConfig {
  items?: FieldConfig[];
  extraConfig?: {
    setter?: SetterType;
    defaultValue?: any | ((field: SettingField, editor: any) => any);
  };
}

interface RowSetterProps {
  field: SettingField;
  descriptor?: string | ((rowField: SettingField) => string);
  config: ObjectSetterConfig;
  columns?: number;
  primaryButton?: boolean;
}

class RowSetter extends Component<RowSetterProps> {
  static contextType = PopupContext;

  state: any = {
    descriptor: '',
  };

  private items?: SettingField[];
  constructor(props: RowSetterProps) {
    super(props);
    const { config, descriptor, field, columns } = props;
    const items: SettingField[] = [];
    if (columns && config.items) {
      const l = Math.min(config.items.length, columns);
      for (let i = 0; i < l; i++) {
        const conf = config.items[i];
        if (conf.required || conf.important) {
          const item = field.createField({
            ...conf,
            // in column-cell
            forceInline: 3,
          });
          items.push(item);
        }
      }
    }

    if (items.length > 0) {
      this.items = items;
    }

    if (descriptor) {
      if (typeof descriptor === 'function') {
        let firstRun: boolean = true;
        field.onEffect(() => {
          const state = {
            descriptor: descriptor(field),
          };
          if (firstRun) {
            firstRun = false;
            this.state = state;
          } else {
            this.setState(state);
          }
        });
      } else {
        this.state = {
          descriptor,
        };
      }
    } else {
      // todo: onEffect change field.name
      this.state = {
        descriptor: field.title || `项目 ${field.name}`,
      };
    }
  }

  shouldComponentUpdate(_: any, nextState: any) {
    if (this.state.decriptor !== nextState.decriptor) {
      return true;
    }
    return false;
  }

  private pipe: any;
  render() {
    const items = this.items;
    const { field, primaryButton } = this.props;

    if (!this.pipe) {
      this.pipe = (this.context as PopupPipe).create({ width: 320 });
    }

    const title = (
      <Fragment>
        编辑：
        <Title title={this.state.descriptor} />
      </Fragment>
    );

    this.pipe.send(<FormSetter key={field.id} />, title);

    if (items) {
      return (
        <div className="lc-setter-object-row">
          <div
            className="lc-setter-object-row-edit"
            onClick={e => {
              this.pipe.show((e as any).target);
            }}
          >
            <Icon size="small" type="edit" />
          </div>
          <div className="lc-setter-object-row-body">{items.map(item => createSettingFieldView(item, field))}</div>
        </div>
      );
    }

    return (
      <Button
        type={primaryButton === false ? 'normal' : 'primary'}
        onClick={e => {
          this.pipe.show((e as any).target);
        }}
      >
        <Icon type="edit" />
        {title}
      </Button>
    );
  }
}

// form-field setter
class FormSetter extends Component<{}> {
  render() {
    return 'yes';
  }
}
