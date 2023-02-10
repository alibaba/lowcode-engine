import { Component, PureComponent, createElement, createContext, forwardRef } from 'rax';
import findDOMNode from 'rax-find-dom-node';
import {
  adapter,
  addonRendererFactory,
  tempRendererFactory,
  rendererFactory,
} from '@alilc/lowcode-renderer-core';
import pageRendererFactory from './renderer/page';
import componentRendererFactory from './renderer/component';
import blockRendererFactory from './renderer/block';
import CompFactory from './hoc/compFactory';

adapter.setRuntime({
  Component,
  PureComponent,
  createContext,
  createElement,
  forwardRef,
  findDOMNode,
});

adapter.setRenderers({
  PageRenderer: pageRendererFactory(),
  ComponentRenderer: componentRendererFactory(),
  BlockRenderer: blockRendererFactory(),
  AddonRenderer: addonRendererFactory(),
  TempRenderer: tempRendererFactory(),
});

function factory() {
  const Renderer = rendererFactory();
  return class extends Renderer {
    constructor(props: any, context: any) {
      super(props, context);
    }

    isValidComponent(obj: any) {
      return obj?.prototype?.setState || obj?.prototype instanceof Component;
    }
  };
}

const RaxRenderer: any = factory();
const Engine: any = RaxRenderer;

export {
  Engine,
  CompFactory,
};

export default RaxRenderer;
