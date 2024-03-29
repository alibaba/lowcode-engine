import {
  IPublicApiCommonUI,
  IPublicModelPluginContext,
  IPublicTypeContextMenuAction,
} from '@alilc/lowcode-types';
import { HelpTip, IEditor, Tip as InnerTip, Title as InnerTitle } from '@alilc/lowcode-editor-core';
import {
  Balloon,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dialog,
  Dropdown,
  Form,
  Icon,
  Input,
  Loading,
  Message,
  Overlay,
  Pagination,
  Radio,
  Search,
  Select,
  SplitButton,
  Step,
  Switch,
  Tab,
  Table,
  Tree,
  TreeSelect,
  Upload,
  Divider,
} from '@alifd/next';
import { ContextMenu } from '../components/context-menu';
import { editorSymbol } from '../symbols';
import { ReactElement } from 'react';

export class CommonUI implements IPublicApiCommonUI {
  [editorSymbol]: IEditor;

  Balloon = Balloon;
  Breadcrumb = Breadcrumb;
  Button = Button;
  Card = Card;
  Checkbox = Checkbox;
  DatePicker = DatePicker;
  Dialog = Dialog;
  Dropdown = Dropdown;
  Form = Form;
  Icon = Icon;
  Input = Input;
  Loading = Loading as any;
  Message = Message;
  Overlay = Overlay;
  Pagination = Pagination;
  Radio = Radio;
  Search = Search;
  Select = Select;
  SplitButton = SplitButton;
  Step = Step as any;
  Switch = Switch;
  Tab = Tab;
  Table = Table;
  Tree = Tree;
  TreeSelect = TreeSelect;
  Upload = Upload;
  Divider = Divider;

  ContextMenu: ((props: {
    menus: IPublicTypeContextMenuAction[];
    children: React.ReactElement[] | React.ReactElement;
  }) => ReactElement) & {
    create(menus: IPublicTypeContextMenuAction[], event: MouseEvent | React.MouseEvent): void;
  };

  constructor(editor: IEditor) {
    this[editorSymbol] = editor;

    const innerContextMenu = (props: any) => {
      const pluginContext: IPublicModelPluginContext = editor.get(
        'pluginContext',
      ) as IPublicModelPluginContext;
      return <ContextMenu {...props} pluginContext={pluginContext} />;
    };

    innerContextMenu.create = (menus: IPublicTypeContextMenuAction[], event: MouseEvent) => {
      const pluginContext: IPublicModelPluginContext = editor.get(
        'pluginContext',
      ) as IPublicModelPluginContext;
      return ContextMenu.create(pluginContext, menus, event);
    };

    this.ContextMenu = innerContextMenu;
  }

  get Tip() {
    return InnerTip;
  }

  get HelpTip() {
    return HelpTip;
  }

  get Title() {
    return InnerTitle;
  }
}
