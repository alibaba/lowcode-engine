import renderer from './renderer';

if (typeof window !== 'undefined') {
  (window as any).SimulatorRenderer = renderer;
}

export default renderer;
