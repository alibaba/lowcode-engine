import { Box, Breadcrumb, Form, Select, Input, Button, Table, Pagination, Dialog } from '@alifd/next';

const Div = (props) => (<div {...props}>{props.children}</div>);

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
};

export default components;