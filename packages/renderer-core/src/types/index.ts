import { BuiltinSimulatorHost } from '@ali/lowcode-designer';
import { baseRendererFactory } from '../renderer';
import baseRenererFactory from '../renderer/base';

export type IBaseRenderer = ReturnType<typeof baseRenererFactory>;
export type IBaseRendererInstance = InstanceType<ReturnType<typeof baseRendererFactory>>;

export interface IProps {
  schema: ISchema;
  components: { [key: string]: any };
  className?: string;
  locale?: string;
  appHelper?: any;
  componentsMap?: { [key: string]: any };
  designMode?: string;
  suspended?: boolean;
  onCompGetRef?: (schema: ISchema, ref: any) => void;
  onCompGetCtx?: (schema: ISchema, ref: any) => void;
  customCreateElement?: (...args: any) => any;
  rendererName: string;
  notFoundComponent?: any;
  faultComponent?: any;
}

export interface IState {
  engineRenderError?: boolean;
  error?: Error
  onCompGetRef: (schema: ISchema, ref: any) => void;
  onCompGetCtx: (schema: ISchema, ref: any) => void;
  customCreateElement: (...args: any) => any;
  notFoundComponent: any;
  faultComponent: any;
  [key: string]: any;
}
export interface IRendererProps {
  locale?: string;
  messages: object;
  __appHelper: object;
  __components: object;
  __ctx: object;
  __schema: ISchema;
  __host?: BuiltinSimulatorHost;
  __container?: any;
  [key: string]: any;
}

export interface ComponentModel {
  componentName: string;
  props: any;
  children: ComponentModel[];
}

export interface ISchema {
  componentName: string;
  props: any;
  children: ComponentModel[]
  dataSource?: any;
  methods?: any;
  lifeCycles?: any;
  [key: string]: any;
}

export interface IInfo {
  schema: ISchema;
  Comp: any;
  componentInfo?: any;
  componentChildren?: any
}

export interface JSExpression {
  type: string;
  value: string;
}

export interface DataSourceItem {
  id: string;
  isInit: boolean;
  type: string;
  options: {
    uri: string;
    params: object;
    method: string;
    shouldFetch?: string;
    willFetch?: string;
    fit?: string;
    didFetch?: string;
  };
  dataHandler: JSExpression;
}

export interface DataSource {
  list: DataSourceItem[];
  dataHandler: JSExpression;
}

export type Constructor = new(...args: any) => any;

export interface IRuntime {
  Component: Constructor;
  PureComponent: Constructor;
  createElement: (...args: any) => any;
  createContext: (...args: any) => any;
  forwardRef: (...args: any) => any;
  findDOMNode: (...args: any) => any;
  [key: string]: any;
}

export interface IRendererModules {
  BaseRenderer?: new(...args: any) => IRenderer;
  PageRenderer: any;
  ComponentRenderer: any;
  BlockRenderer?: any,
  AddonRenderer?: any,
  TempRenderer?: any,
  DivRenderer?: any;
}

export interface IRenderer {
  props?: IRendererProps;
  context?: any;
  reloadDataSource: () => Promise<any>;
  getSchemaChildren: (schema: ISchema) => any;
  __beforeInit: (props: IRendererProps) => any;
  __init: (props: IRendererProps) => any;
  __afterInit: (props: IRendererProps) => any;
  __setLifeCycleMethods: (method: string, args?: any) => any;
  __bindCustomMethods: (props: IRendererProps) => any;
  __generateCtx: (ctx: object) => any;
  __parseData: (data: any, ctx?: object) => any;
  __initDataSource: (props: IRendererProps) => any;
  __render: () => any;
  __getRef: (ref: any) => any;
  __getSchemaChildrenVirtualDom: (schema: ISchema, Comp: any, nodeChildrenMap?: Map<string, any>) => any;
  __getComponentProps: (schema: ISchema, Comp: any, componentInfo: any) => any;
  __createDom: () => any;
  __createVirtualDom: (schema: any, self: any, parentInfo: IInfo, idx: string | number) => any;
  __createLoopVirtualDom: (schema: any, self: any, parentInfo: IInfo, idx: number | string) => any;
  __parseProps: (props: any, self: any, path: string, info: IInfo) => any;
  __initDebug: () => void;
  __debug: (msg: string) => void;
  __renderContextProvider: (customProps?: object, children?: any) => any;
  __renderContextConsumer: (children: any) => any;
  __renderContent: (children: any) => any;
  __checkSchema: (schema: ISchema, extraComponents?: string | string[]) => any;
  __renderComp: (Comp: any, ctxProps: object) => any;
  $: (filedId: string, instance?: any) => any;
}
