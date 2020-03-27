import renderer from './renderer';

if (typeof window !== 'undefined') {
  window.SimulatorRenderer = renderer;
}

export default renderer;
