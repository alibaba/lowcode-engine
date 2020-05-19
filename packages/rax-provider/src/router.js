import { useRouter } from 'rax-use-router';
import { createHashHistory, createBrowserHistory } from 'history';

const getConfig = (config) => {
  let { history } = config;
  const { routes } = config;
  if (typeof history === 'string') {
    if (history === 'hash') {
      history = createHashHistory();
    } else if (history === 'browser') {
      history = createBrowserHistory();
    }
  }
  return () => ({
    history,
    routes,
  });
};

export default function getRouter(config) {
  return function Router() {
    const configWrapper = getConfig(config);
    const { component } = useRouter(configWrapper);
    return component;
  };
}
