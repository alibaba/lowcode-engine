import { EventEmitter } from 'events';

const domReady = require('domready');
import Flags from './flags';
import { designer } from './editor';

function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function isFullscreen() {
  return document.fullscreen || false;
}

interface IStyleResourceConfig {
  media?: string;
  type?: string;
  content?: string;
}

class StyleResource {
  config: IStyleResourceConfig;
  styleElement: HTMLStyleElement;
  mounted: boolean;
  inited: boolean;

  constructor(config: IStyleResourceConfig) {
    this.config = config || {};
  }

  matchDevice(device: string) {
    const media = this.config.media;

    if (!media || media === 'ALL' || media === '*') {
      return true;
    }

    return media.toUpperCase() === device.toUpperCase();
  }

  init() {
    if (this.inited) {
      return;
    }

    this.inited = true;

    const { type, content } = this.config;

    let styleElement;
    if (type === 'URL') {
      styleElement = document.createElement('link');
      styleElement.href = content || '';
      styleElement.rel = 'stylesheet';
    } else {
      styleElement = document.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = content;
      } else {
        styleElement.appendChild(document.createTextNode(content || ''));
      }
    }
    this.styleElement = styleElement;
  }

  apply() {
    if (this.mounted) {
      return;
    }

    this.init();
    document.head.appendChild(this.styleElement);
    this.mounted = true;
  }

  unmount() {
    if (!this.mounted) {
      return;
    }
    document.head.removeChild(this.styleElement);
    this.mounted = false;
  }
}

export class Viewport {
  preview: boolean;
  focused: boolean;
  slateFixed: boolean;
  emitter: EventEmitter;
  device: string;
  focusTarget: any;
  cssResourceSet: StyleResource[];

  constructor() {
    this.preview = false;
    this.emitter = new EventEmitter();
    document.addEventListener('webkitfullscreenchange', () => {
      this.emitter.emit('fullscreenchange', this.isFullscreen());
    });
    domReady(() => this.applyMediaCSS());
  }

  setFullscreen(flag: boolean) {
    const fullscreen = this.isFullscreen();
    if (fullscreen && !flag) {
      exitFullscreen();
    } else if (!fullscreen && flag) {
      enterFullscreen();
    }
  }

  toggleFullscreen() {
    if (this.isFullscreen()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  isFullscreen() {
    return isFullscreen();
  }

  setFocus(flag: boolean) {
    if (this.focused && !flag) {
      this.focused = false;
      Flags.remove('view-focused');
      this.emitter.emit('focuschange', false);
    } else if (!this.focused && flag) {
      this.focused = true;
      Flags.add('view-focused');
      this.emitter.emit('focuschange', true);
    }
  }

  setFocusTarget(focusTarget: any) {
    this.focusTarget = focusTarget;
  }

  returnFocus() {
    if (this.focusTarget) {
      this.focusTarget.focus();
    }
  }

  isFocus() {
    return this.focused;
  }

  setPreview(flag: boolean) {
    if (this.preview && !flag) {
      this.preview = false;
      Flags.setPreviewMode(false);
      this.emitter.emit('preview', false);
      this.changeViewport();
    } else if (!this.preview && flag) {
      this.preview = true;
      Flags.setPreviewMode(true);
      this.emitter.emit('preview', true);
      this.changeViewport();
    }
  }

  togglePreview() {
    if (this.isPreview()) {
      this.setPreview(false);
    } else {
      this.setPreview(true);
    }
  }

  isPreview() {
    return this.preview;
  }

  setDevice(device = 'pc') {
    if (this.getDevice() !== device) {
      this.device = device;
      designer.currentDocument?.simulator?.set('device', device === 'mobile' ? 'mobile' : 'default');
      // Flags.setSimulator(device);
      // this.applyMediaCSS();
      this.emitter.emit('devicechange', device);
      this.changeViewport();
    }
  }

  getDevice() {
    return this.device || 'pc';
  }

  changeViewport() {
    this.emitter.emit('viewportchange', this.getViewport());
  }

  getViewport() {
    return `${this.isPreview() ? 'preview' : 'design'}-${this.getDevice()}`;
  }

  applyMediaCSS() {
    if (!document.head || !this.cssResourceSet) {
      return;
    }
    const device = this.getDevice();
    this.cssResourceSet.forEach((item) => {
      if (item.matchDevice(device)) {
        item.apply();
      } else {
        item.unmount();
      }
    });
  }

  setGlobalCSS(resourceSet: IStyleResourceConfig[]) {
    if (this.cssResourceSet) {
      this.cssResourceSet.forEach((item) => {
        item.unmount();
      });
    }
    this.cssResourceSet = resourceSet.map((item: IStyleResourceConfig) => new StyleResource(item)).reverse();
    this.applyMediaCSS();
  }

  setWithShell(shell: string) {
    // Flags.setWithShell(shell);
  }

  onFullscreenChange(func: () => any) {
    this.emitter.on('fullscreenchange', func);
    return () => {
      this.emitter.removeListener('fullscreenchange', func);
    };
  }

  onPreview(func: () => any) {
    this.emitter.on('preview', func);
    return () => {
      this.emitter.removeListener('preview', func);
    };
  }

  onDeviceChange(func: () => any) {
    this.emitter.on('devicechange', func);
    return () => {
      this.emitter.removeListener('devicechange', func);
    };
  }

  onSlateFixedChange(func: (flag: boolean) => any) {
    this.emitter.on('slatefixed', func);
    return () => {
      this.emitter.removeListener('slatefixed', func);
    };
  }

  onViewportChange(func: () => any) {
    this.emitter.on('viewportchange', func);
    return () => {
      this.emitter.removeListener('viewportchange', func);
    };
  }

  onFocusChange(func: (flag: boolean) => any) {
    this.emitter.on('focuschange', func);
    return () => {
      this.emitter.removeListener('focuschange', func);
    };
  }
}

export default new Viewport();
