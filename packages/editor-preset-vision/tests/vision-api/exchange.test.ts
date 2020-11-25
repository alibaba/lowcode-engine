import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import formSchema from '../fixtures/schema/form';
import VisualEngine from '../../src';

describe('VisualEngine.Exchange 相关 API 测试', () => {
  it('select / getSelected', () => {
    const doc = VisualEngine.Pages.addPage(formSchema);
    VisualEngine.Exchange.select(doc?.getNode('form'));
    expect(VisualEngine.Exchange.getSelected()?.componentName).toBe('Form');
    expect(VisualEngine.Exchange.getSelected()?.id).toBe('form');

    // clear selection
    VisualEngine.Exchange.select();
    expect(VisualEngine.Exchange.getSelected()).toBeUndefined;
  });

  it('onIntoView', () => {
    expect(typeof VisualEngine.Exchange.onIntoView).toBe('function');
    VisualEngine.Exchange.onIntoView();
  });
});
