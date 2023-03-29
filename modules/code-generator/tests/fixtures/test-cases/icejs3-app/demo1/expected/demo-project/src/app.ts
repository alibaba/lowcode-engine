import { defineAppConfig } from 'ice';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'App',
  },
  router: {
    type: 'browser',
    basename: '/',
  },
}));
