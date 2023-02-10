import Aaaa from '@/pages/Aaaa';

import BasicLayout from '@/layouts/BasicLayout';

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/aaaa',
        component: Aaaa,
      },
    ],
  },
];

export default routerConfig;
