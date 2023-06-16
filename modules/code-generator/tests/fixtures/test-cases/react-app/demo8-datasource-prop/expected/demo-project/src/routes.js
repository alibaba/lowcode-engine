import Example from '@/pages/Example';

import BasicLayout from '@/layouts/BasicLayout';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        component: Example,
      },
    ],
  },
];

export default routerConfig;
