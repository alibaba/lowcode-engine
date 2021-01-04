import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import View from 'rax-view';
import Text from 'rax-text';
import { Engine } from '../src/index';

const components = {
  View,
  Text,
};

const schema = {
  componentName: 'Page',
  fileName: 'home',
  props: {},
  children: [
    {
      componentName: 'View',
      props: {},
      children: [
        {
          componentName: 'Text',
          props: {
            type: 'primary',
          },
          children: ['Welcome to Your Rax App!'],
        },
      ],
    },
  ],
};

render(<Engine schema={schema} components={components} />, document.getElementById('root'), {
  driver: DriverUniversal,
});
