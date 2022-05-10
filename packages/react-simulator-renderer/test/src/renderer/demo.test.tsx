import renderer from 'react-test-renderer';
import rendererContainer from '../../../src/renderer';
import SimulatorRendererView from '../../../src/renderer-view';
import { Text } from '../../utils/components';

describe('Base', () => {
  const component = renderer.create(
    <SimulatorRendererView
      rendererContainer={rendererContainer}
    />
  );

  it('should be render NotFoundComponent', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should be render Text', () => {
    // 更新 _componentsMap 值
    (rendererContainer as any)._componentsMap.Text = Text;//  = host.designer.componentsMap;
    // 更新 components 列表
    (rendererContainer as any).buildComponents();

    expect(!!(rendererContainer.components as any).Text).toBeTruthy();

    rendererContainer.rerender();

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})