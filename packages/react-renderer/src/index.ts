import React, { Component, PureComponent, createElement, createContext, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import {
  adapter,
  pageRendererFactory,
  componentRendererFactory,
  blockRendererFactory,
  addonRendererFactory,
  tempRendererFactory,
  rendererFactory
} from '@ali/lowcode-renderer-core';
import ConfigProvider from '@alifd/next/lib/config-provider';

window.React = React;
(window as any).ReactDom = ReactDOM;

adapter.setRuntime({
  Component,
  PureComponent,
  createContext,
  createElement,
  forwardRef,
  findDOMNode: ReactDOM.findDOMNode,
});

adapter.setRenderers({
  PageRenderer: pageRendererFactory(),
  ComponentRenderer: componentRendererFactory(),
  BlockRenderer: blockRendererFactory(),
  AddonRenderer: addonRendererFactory(),
  TempRenderer: tempRendererFactory(),
  DivRenderer: blockRendererFactory(),
});

adapter.setConfigProvider(ConfigProvider);

function factory() {
  const Renderer = rendererFactory();
  return class ReactRenderer extends Renderer {
    constructor(props: any, context: any) {
      super(props, context);
    }
  
    isValidComponent(obj: any) {
      return obj?.prototype?.isReactComponent || obj?.prototype instanceof Component;
    }
  }
}

export default factory();
