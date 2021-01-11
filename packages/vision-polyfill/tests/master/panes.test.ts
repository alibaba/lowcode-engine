import '../fixtures/window';
// import { Project } from '../../src/project/project';
// import { Node } from '../../src/document/node/node';
// import { Designer } from '../../src/designer/designer';
import panes from '../../src/panes';
import { autorun } from '@ali/lowcode-editor-core';

describe('panes 测试', () => {
  it('add: type dock | PanelDock', () => {
    const mockDockShow = jest.fn();
    const mockDockHide = jest.fn();
    const { DockPane } = panes;
    const offDockShow = DockPane.onDockShow(mockDockShow);
    const offDockHide = DockPane.onDockHide(mockDockHide);

    const pane1 = panes.add({
      name: 'trunk',
      type: 'dock',
      width: 300,
      description: '组件库',
      contents: [
        {
          title: '普通组件',
          tip: '普通组件',
          content: () => 'haha',
        },
      ],
      menu: '组件库',
      defaultFixed: true,
    });

    const pane2 = panes.add({
      name: 'trunk2',
      type: 'dock',
      width: 300,
      description: '组件库',
      contents: [
        {
          title: '普通组件',
          tip: '普通组件',
          content: () => 'haha',
        },
      ],
      menu: '组件库',
      defaultFixed: true,
    });

    const pane3 = panes.add({
      name: 'trunk3',
      type: 'dock',
      isAction: true,
    });

    // DockPane.container.items.map(item => console.log(item.name))
    // 2 trunks + 1 outline-pane
    expect(DockPane.container.items.length).toBe(4);

    DockPane.activeDock(pane1);
    // expect(mockDockShow).toHaveBeenCalledTimes(1);
    // expect(mockDockShow).toHaveBeenLastCalledWith(pane1);
    expect(DockPane.container.items[1].visible).toBeTruthy;

    DockPane.activeDock(pane2);
    expect(DockPane.container.items[2].visible).toBeTruthy;
    // expect(mockDockShow).toHaveBeenCalledTimes(2);
    // expect(mockDockShow).toHaveBeenLastCalledWith(pane2);
    // expect(mockDockHide).toHaveBeenCalledTimes(1);
    // expect(mockDockHide).toHaveBeenLastCalledWith(pane1);

    DockPane.activeDock();
    DockPane.activeDock({ name: 'unexisting' });

    offDockShow();
    offDockHide();

    // DockPane.activeDock(pane1);
    // expect(mockDockShow).toHaveBeenCalledTimes(2);
    // expect(mockDockHide).toHaveBeenCalledTimes(1);

    expect(typeof DockPane.getDocks).toBe('function');
    DockPane.getDocks();
    expect(typeof DockPane.setFixed).toBe('function');
    DockPane.setFixed();
  });

  it('add: type action', () => {
    panes.add({
      name: 'trunk',
      type: 'action',
      init() {},
      destroy() {},
    });

    const { ActionPane } = panes;
    expect(typeof ActionPane.getActions).toBe('function');
    ActionPane.getActions();
    expect(typeof ActionPane.setActions).toBe('function');
    ActionPane.setActions();
    expect(ActionPane.getActions()).toBe(ActionPane.actions);
  });

  it('add: type action - extraConfig', () => {
    panes.add({
      name: 'trunk',
      type: 'action',
      init() {},
      destroy() {},
    }, {});
  });

  it('add: type action - function', () => {
    panes.add(() => ({
      name: 'trunk',
      type: 'action',
      init() {},
      destroy() {},
    }));
  });

  it('add: type tab', () => {
    panes.add({
      name: 'trunk',
      type: 'tab',
    });
    const { TabPane } = panes;
    expect(typeof TabPane.setFloat).toBe('function');
    TabPane.setFloat();
  });

  it('add: type stage', () => {
    panes.add({
      id: 'stage1',
      type: 'stage',
    });
    panes.add({
      type: 'stage',
    });

    const { Stages } = panes;
    expect(typeof Stages.getStage).toBe('function');
    Stages.getStage();
    expect(typeof Stages.createStage).toBe('function');
    Stages.createStage({
      id: 'stage1',
      type: 'stage',
    });
    Stages.createStage({
      type: 'stage',
    });
  });

  it('add: type stage - id', () => {
    panes.add({
      id: 'trunk',
      name: 'trunk',
      type: 'stage',
    });
  });

  it('add: type widget', () => {
    panes.add({
      name: 'trunk',
      type: 'widget',
    });
  });

  it('add: type null', () => {
    panes.add({
      name: 'trunk',
    });

    const { toolbar } = panes;
    expect(typeof toolbar.setContents).toBe('function');
    toolbar.setContents();
  });
});
