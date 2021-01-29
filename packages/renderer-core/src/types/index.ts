export interface IProps {
  appHelper: any;
  components: { [key: string]: any };
  componentsMap: { [key: string]: any };
  designMode: string;
  suspended: boolean;
  schema: ISchema;
  onCompGetRef: (schema: ISchema, ref: any) => void;
  onCompGetCtx: (schema: ISchema, ref: any) => void;
  customCreateElement: (...args: any) => any;
  notFoundComponent: any;
  faultComponent: any;
}

export interface IRendererProps {
  locale: string;
  messages: object;
  __appHelper: object;
  __components: object;
  __ctx: object;
  __schema: ISchema;
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
  schema: any;
  Comp: any;
  componentInfo?: any;
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

type Constructor = new(...args: any) => any;

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
  BaseRenderer?: any;
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
  __beforeInit: (props: IRendererProps) => any;
  __init: (props: IRendererProps) => any;
  __afterInit: (props: IRendererProps) => any;
  reloadDataSource: () => Promise<any>;
  __setLifeCycleMethods: (method: string, args?: any) => any;
  __bindCustomMethods: (props: IRendererProps) => any;
  __generateCtx: (ctx: object) => any;
  __parseData: (data: any, ctx?: object) => any;
  __initDataSource: (props: IRendererProps) => any;
  __render: () => any;
  __getRef: (ref: any) => any;
  getSchemaChildren: (schema: ISchema) => any;
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
