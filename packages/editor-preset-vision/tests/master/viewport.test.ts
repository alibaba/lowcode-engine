import '../fixtures/window';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { editor } from '../../src/editor';
import { Viewport } from '../../src/viewport';
import domready from 'domready';

// const editor = globalContext.get(Editor);

jest.mock('domready', () => {
  return (fn) => fn();
});

// 貌似 jsdom 没有响应 fullscreen 变更事件，先这么 mock 吧
const mockSetFullscreen = flag => { document.fullscreen = flag; };

describe('viewport 测试', () => {
  mockSetFullscreen(true);

  it('getDevice / setDevice / getViewport / onDeviceChange / onViewportChange', async () => {
    const viewport = new Viewport();
    const mockDeviceChange = jest.fn();
    const mockViewportChange = jest.fn();
    const offDevice = viewport.onDeviceChange(mockDeviceChange);
    const offViewport = viewport.onViewportChange(mockViewportChange);
    expect(viewport.getDevice()).toBe('pc');
    expect(viewport.getViewport()).toBe('design-pc');
    editor.set('currentDocument', { simulator: { set() {} } });

    await viewport.setDevice('mobile');
    expect(viewport.getDevice()).toBe('mobile');
    expect(viewport.getViewport()).toBe('design-mobile');
    expect(mockDeviceChange).toHaveBeenCalledTimes(1);
    expect(mockViewportChange).toHaveBeenCalledTimes(1);

    offDevice();
    offViewport();
    await viewport.setDevice('pc');
    expect(mockDeviceChange).toHaveBeenCalledTimes(1);
    expect(mockViewportChange).toHaveBeenCalledTimes(1);
  });

  it('setPreview / isPreview / togglePreivew / getViewport / onViewportChange', () => {
    const viewport = new Viewport();
    const mockViewportChange = jest.fn();
    const mockPreivewChange = jest.fn();
    const off = viewport.onViewportChange(mockViewportChange);
    const offPreview = viewport.onPreview(mockPreivewChange);
    viewport.setPreview(true);
    expect(viewport.isPreview).toBeTruthy;
    expect(viewport.getViewport()).toBe('preview-pc');
    expect(mockViewportChange).toHaveBeenCalledTimes(1);
    expect(mockPreivewChange).toHaveBeenCalledTimes(1);
    viewport.setPreview(false);
    expect(viewport.isPreview).toBeFalsy;
    expect(viewport.getViewport()).toBe('design-pc');
    expect(mockViewportChange).toHaveBeenCalledTimes(2);
    expect(mockPreivewChange).toHaveBeenCalledTimes(2);
    viewport.togglePreview();
    expect(viewport.getViewport()).toBe('preview-pc');
    expect(mockViewportChange).toHaveBeenCalledTimes(3);
    expect(mockPreivewChange).toHaveBeenCalledTimes(3);
    viewport.togglePreview();
    expect(viewport.getViewport()).toBe('design-pc');
    expect(mockViewportChange).toHaveBeenCalledTimes(4);
    expect(mockPreivewChange).toHaveBeenCalledTimes(4);

    off();
    offPreview();
    viewport.togglePreview();
    expect(mockViewportChange).toHaveBeenCalledTimes(4);
    expect(mockPreivewChange).toHaveBeenCalledTimes(4);
  });

  it('setFocusTarget / returnFocus / setFocus / isFocus / onFocusChange', () => {
    const viewport = new Viewport();
    const mockFocusChange = jest.fn();
    const off = viewport.onFocusChange(mockFocusChange);
    viewport.setFocusTarget(document.createElement('div'));
    viewport.returnFocus();

    viewport.setFocus(true);
    expect(viewport.isFocus()).toBeTruthy();
    expect(mockFocusChange).toHaveBeenCalledTimes(1);
    expect(mockFocusChange).toHaveBeenLastCalledWith(true);
    viewport.setFocus(false);
    expect(viewport.isFocus()).toBeFalsy();
    expect(mockFocusChange).toHaveBeenCalledTimes(2);
    expect(mockFocusChange).toHaveBeenLastCalledWith(false);

    off();
    viewport.setFocus(false);
    expect(mockFocusChange).toHaveBeenCalledTimes(2);
  });

  it('isFullscreen / toggleFullscreen / setFullscreen / onFullscreenChange', () => {
    const viewport = new Viewport();
    const mockFullscreenChange = jest.fn();
    const off = viewport.onFullscreenChange(mockFullscreenChange);

    mockSetFullscreen(false);
    viewport.setFullscreen(true);
    mockSetFullscreen(true);
    expect(viewport.isFullscreen()).toBeTruthy;
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(1);
    viewport.setFullscreen(true);
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(1);

    mockSetFullscreen(true);
    viewport.setFullscreen(false);
    mockSetFullscreen(false);
    expect(viewport.isFullscreen()).toBeFalsy;
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(2);
    viewport.setFullscreen(false);
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(2);

    mockSetFullscreen(true);
    viewport.toggleFullscreen();
    mockSetFullscreen(false);
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(3);
    viewport.toggleFullscreen();
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(4);

    off();
    viewport.toggleFullscreen();
    // expect(mockFullscreenChange).toHaveBeenCalledTimes(4);
  });

  it('setWithShell', () => {
    const viewport = new Viewport();
    viewport.setWithShell();
  });

  it('onSlateFixedChange', () => {
    const viewport = new Viewport();
    const mockSlateFixedChange = jest.fn();
    const off = viewport.onSlateFixedChange(mockSlateFixedChange);

    viewport.emitter.emit('slatefixed');
    expect(mockSlateFixedChange).toHaveBeenCalledTimes(1);
    off();
    viewport.emitter.emit('slatefixed');
    expect(mockSlateFixedChange).toHaveBeenCalledTimes(1);
  });

  it('setGlobalCSS', () => {
    const viewport = new Viewport();
    viewport.setGlobalCSS([{
      media: '*',
      type: 'URL',
      content: '//path/to.css',
    }, {
      media: 'ALL',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }, {
      media: '',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }, {
      media: 'mobile',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }]);

    viewport.cssResourceSet[0].apply();
    viewport.cssResourceSet[0].init();
    viewport.cssResourceSet[1].apply();
    viewport.cssResourceSet[1].apply();
    viewport.cssResourceSet[1].unmount();

    viewport.setGlobalCSS([{
      media: '*',
      type: 'URL',
      content: '//path/to.css',
    }, {
      media: 'ALL',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }, {
      media: '',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }, {
      media: 'mobile',
      type: 'text',
      content: 'body {font-size: 50px;}',
    }]);
  });
});
