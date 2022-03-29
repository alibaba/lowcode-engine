import { Box, Breadcrumb, Form, Select, Input, Button, Table, Pagination, Dialog } from '@alifd/next';

const Div = (props: any) => (<div {...props}>{props.children}</div>);

const Text = (props: any) => (<div>{props.content}</div>);

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
};

export default components;