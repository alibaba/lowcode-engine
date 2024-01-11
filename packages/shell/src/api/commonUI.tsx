import { IPublicApiCommonUI, IPublicModelPluginContext, IPublicTypeContextMenuAction } from '@alilc/lowcode-types';
import {
  IEditor,
  Tip as InnerTip,
  Title as InnerTitle,
 } from '@alilc/lowcode-editor-core';
import { Balloon, Breadcrumb, Button, Card, Checkbox, DatePicker, Dialog, Dropdown, Form, Icon, Input, Loading, Message, Overlay, Pagination, Radio, Search, Select, SplitButton, Step, Switch, Tab, Table, Tree, TreeSelect, Upload, Divider } from '@alifd/next';
import { ContextMenu } from '../components/context-menu';
import { editorSymbol } from '../symbols';

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
  Loading = Loading;
  Message = Message;
  Overlay = Overlay;
  Pagination = Pagination;
  Radio = Radio;
  Search = Search;
  Select = Select;
  SplitButton = SplitButton;
  Step = Step;
  Switch = Switch;
  Tab = Tab;
  Table = Table;
  Tree = Tree;
  TreeSelect = TreeSelect;
  Upload = Upload;
  Divider = Divider;

  constructor(editor: IEditor) {
    this[editorSymbol] = editor;
  }

  get Tip() {
    return InnerTip;
  }
  get Title() {
    return InnerTitle;
  }

  get ContextMenu() {
    const editor = this[editorSymbol];
    const innerContextMenu = (props: any) => {
      const pluginContext: IPublicModelPluginContext = editor.get('pluginContext') as IPublicModelPluginContext;
      return <ContextMenu {...props} pluginContext={pluginContext} />;
    };

    innerContextMenu.create = (menus: IPublicTypeContextMenuAction[], event: MouseEvent) => {
      const pluginContext: IPublicModelPluginContext = editor.get('pluginContext') as IPublicModelPluginContext;
      return ContextMenu.create(pluginContext, menus, event);
    };

    return innerContextMenu;
  }
}
