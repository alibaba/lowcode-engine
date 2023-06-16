import { createApp } from 'ice';

const appConfig = {
  app: {
    rootId: 'app',
  },
  router: {
    type: 'hash',
  },
};
createApp(appConfig);
