import { App, type AppOptions } from '../app';

export const createApp = async (options: AppOptions) => {
  const app = new App(options);

  await app.startup();

  return app;
};
