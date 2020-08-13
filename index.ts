import renderer from './packages/react-simulator-renderer/src/renderer';

if (typeof window !== 'undefined') {
  (window as any).SimulatorRenderer = renderer;
}

export default renderer;
