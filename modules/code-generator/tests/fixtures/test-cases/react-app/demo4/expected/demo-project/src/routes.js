import Test from '@/pages/Test';

import BasicLayout from '@/layouts/BasicLayout';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        component: Test,
      },
    ],
  },
];

export default routerConfig;
