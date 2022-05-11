import React from 'react';
import { Box, Breadcrumb, Form, Select, Input, Button, Table, Pagination, Dialog } from '@alifd/next';

const Div = ({_leaf, ...rest}: any) => (<div {...rest}>{rest.children}</div>);

const MiniRenderDiv = ({_leaf, ...rest}: any) => {
  return (
    <div {...rest}>
      {rest.children}
    </div>
  );
};

const Text = ({_leaf, ...rest}: any) => (<div {...rest}>{rest.content}</div>);

const SlotComponent = (props: any) => props.mobileSlot;

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
  ErrorComponent: Select,
  Div,
  SlotComponent,
  Text,
  MiniRenderDiv,
};

export default components;
