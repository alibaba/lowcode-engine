import { Component } from "react";
import { FieldConfig } from '../../main';

class ObjectSetter extends Component<{
  mode?: 'popup' | 'row' | 'form';
  forceInline?: number;
}> {
  render() {
    const { mode, forceInline = 0 } = this.props;
    if (forceInline || (mode === 'popup' || mode === 'row')) {
      if (forceInline < 2 || mode === 'row') {
        // row
      } else {
        // popup
      }
    } else {
      // form
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

// for table|list row
class RowSetter extends Component<{
  config: ObjectSetterConfig;
  columnsLimit?: number;
}> {
  render() {

  }
}

// form-field setter
class FormSetter extends Component<{}> {

}
