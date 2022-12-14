import $ from '@/pages/$';

import BasicLayout from '@/layouts/BasicLayout';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        component: $,
      },
    ],
  },
];

export default routerConfig;
