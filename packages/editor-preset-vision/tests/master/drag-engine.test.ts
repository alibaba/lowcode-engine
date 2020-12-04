import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Editor } from '@ali/lowcode-editor-core';
// import { Designer } from '@ali/lowcode-designer';
import { designer } from '../../src/editor';
import DragEngine from '../../src/drag-engine';
import formSchema from '../fixtures/schema/form';

// const editor = new Editor();
// const designer = new Designer({ editor });
designer.project.open(formSchema);

const mockBoostPrototype = jest.fn((e: MouseEvent) => {
  return {
    isPrototype: true,
    getComponentName() {
      return 'Div';
    },
  };
});

const mockBoostNode = jest.fn((e: MouseEvent) => {
  return designer.currentDocument?.getNode('node_k1ow3cbo');
});

const mockBoostNodeData = jest.fn((e: MouseEvent) => {
  return {
    type: 'NodeData',
    componentName: 'Div',
  };
});

const mockBoostNull = jest.fn((e: MouseEvent) => {
  return null;
});

const mockDragstart = jest.fn();
const mockDrag = jest.fn();
const mockDragend = jest.fn();

describe('drag-engine 测试', () => {
  it('prototype', async () => {
    DragEngine.from(document, mockBoostPrototype);

    DragEngine.onDragstart(mockDragstart);
    DragEngine.onDrag(mockDrag);
    DragEngine.onDragend(mockDragend);

    const mousedownEvt = new MouseEvent('mousedown');
    document.dispatchEvent(mousedownEvt);
    designer.dragon.emitter.emit('dragstart', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')],
      },
      originalEvent: mousedownEvt,
    });

    // await new Promise(resolve => resolve(setTimeout, 500));

    expect(mockDragstart).toHaveBeenCalled();

    designer.dragon.emitter.emit('drag', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')]
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDrag).toHaveBeenCalled();
    expect(DragEngine.inDragging()).toBeTruthy;

    designer.dragon.emitter.emit('dragend', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')]
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDragend).toHaveBeenCalled();
  });

  it('Node', async () => {
    DragEngine.from(document, mockBoostNode);

    DragEngine.onDragstart(mockDragstart);
    DragEngine.onDrag(mockDrag);
    DragEngine.onDragend(mockDragend);

    const mousedownEvt = new MouseEvent('mousedown');
    document.dispatchEvent(mousedownEvt);
    designer.dragon.emitter.emit('dragstart', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')],
      },
      originalEvent: mousedownEvt,
    });

    // await new Promise(resolve => resolve(setTimeout, 500));

    expect(mockDragstart).toHaveBeenCalled();

    designer.dragon.emitter.emit('drag', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')]
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDrag).toHaveBeenCalled();

    designer.dragon.emitter.emit('dragend', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')]
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDragend).toHaveBeenCalled();
  });

  it('NodeData', async () => {
    DragEngine.from(document, mockBoostNodeData);

    DragEngine.onDragstart(mockDragstart);
    DragEngine.onDrag(mockDrag);
    DragEngine.onDragend(mockDragend);

    const mousedownEvt = new MouseEvent('mousedown');
    document.dispatchEvent(mousedownEvt);
    designer.dragon.emitter.emit('dragstart', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')],
      },
      originalEvent: mousedownEvt,
    });

    // await new Promise(resolve => resolve(setTimeout, 500));

    expect(mockDragstart).toHaveBeenCalled();

    designer.dragon.emitter.emit('drag', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')]
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDrag).toHaveBeenCalled();

    designer.dragon.emitter.emit('dragend', {
      dragObject: {
        type: 'nodedata',
        data: {
          componentName: 'Div',
        },
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDragend).toHaveBeenCalled();
  });

  it('null', async () => {
    DragEngine.from(document, mockBoostNull);

    DragEngine.onDragstart(mockDragstart);
    DragEngine.onDrag(mockDrag);
    DragEngine.onDragend(mockDragend);

    const mousedownEvt = new MouseEvent('mousedown');
    document.dispatchEvent(mousedownEvt);
    designer.dragon.emitter.emit('dragstart', {
      dragObject: {
        nodes: [designer.currentDocument?.getNode('node_k1ow3cbo')],
      },
      originalEvent: mousedownEvt,
    });

    expect(mockDragstart).toHaveBeenCalled();
  });
});
