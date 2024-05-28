import { definePlugin, createApp } from '@alilc/lowcode-react-renderer';

const p = definePlugin({
  name: '',
  setup(app, { boosts }) {
    boosts.getAppWrappers;
  },
});

const app = createApp({});

app.then((app) => {
  app.use(p);
});
