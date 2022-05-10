import { Box, Breadcrumb, Form, Select, Input, Button, Table, Pagination, Dialog } from '@alifd/next';
import defaultSchema from '../schema/basic';
import { Page } from './components';

class Designer {
  componentsMap = {
    Box,
    Breadcrumb,
    'Breadcrumb.Item': Breadcrumb.Item,
    Form,
    'Form.Item': Form.Item,
    Select,
    Input,
    Button,
    'Button.Group': Button.Group,
    Table,
    Pagination,
    Dialog,
    Page,
  }
}

class Host {
  designer = new Designer();

  connect = () => {}

  autorun = (fn: Function) => {
    fn();
  }

  autoRender = true;

  componentsConsumer = {
    consume() {}
  }

  schema = defaultSchema;

  project = {
    documents: [
      {
        id: '1',
        path: '/',
        fileName: '',
        export: () => {
          return this.schema;
        },
        getNode: () => {},
      }
    ],
    get: () => ({}),
  }

  setInstance() {}

  designMode = 'design'

  get() {}

  injectionConsumer = {
    consume() {}
  }

  /** 下列的函数或者方法是方便测试用 */
  mockSchema = (schema: any) => {
    this.schema = schema;
  };
}

if (!(window as any).LCSimulatorHost) {
  (window as any).LCSimulatorHost = new Host();
}

export default (window as any).LCSimulatorHost;