import React from 'react';
import renderer from 'react-test-renderer';
import { Box, Breadcrumb, Form, Select, Input, Button, Table, Pagination, Dialog } from '@alifd/next';
import ReactRenderer from '../src';
import schema from './fixtures/schema/basic';

describe('React Renderer', () => {
  it('render basic case', () => {
    const components = {
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
    };
    const content = (
      <ReactRenderer
        schema={schema}
        components={components}
      />);
    const tree = renderer.create(content).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
