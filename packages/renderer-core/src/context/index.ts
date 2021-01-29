import adapter from '../adapter';


export default function contextFactory() {
  const { createContext } = adapter.getRuntime();

  let context = (window as any).__appContext;
  if (!context) {
    context = createContext({});
    (window as any).__appContext = context;
  }
  return context;
}
