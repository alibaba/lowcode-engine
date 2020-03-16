import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { on, off } from '@ali/b3-one/lib/event';
import AppHelper from '../../utils/appHelper';
import SchemaHelper from '../../utils/schemaHelper';
import DndHelper from '../../utils/dndHelper';
import Engine from '../../engine';

import CompFactory from '../../hoc/compFactory';
import {
  isSchema,
  isFileSchema,
  isEmpty,
  isJSSlot,
  jsonuri,
  registShortCuts,
  unRegistShortCuts,
  generateUtils,
  parseObj,
  shallowEqual,
  addCssTag,
  transformSchemaToPure,
  goldlog
} from '../../utils';
import './index.scss';

const DESIGN_MODE = {
  EXTEND: 'extend',
  BORDER: 'border',
  PREVIEW: 'preview'
};

const DEFAULT_PLACEHOLDER = {
  emptyImage: '//img.alicdn.com/tfs/TB1zpkUoUT1gK0jSZFhXXaAtVXa-620-430.png',
  emptyText: '当前页面为空～\n请拖拽组件放入页面容器内吧！',
  nullImage: '//img.alicdn.com/tfs/TB1m_oSoND1gK0jSZFsXXbldVXa-620-430.png',
  nullText: '编辑内容不存在～！'
};

export default class Canvas extends PureComponent {
  static displayName = 'Canvas';
  static propTypes = {
    appHelper: PropTypes.object,
    components: PropTypes.object,
    engine: PropTypes.element,
    onCreate: PropTypes.func,
    initSchema: PropTypes.object,
    shortCuts: PropTypes.array,
    utils: PropTypes.object
  };
  static defaultProps = {
    components: {},
    engine: Engine,
    onCreate: () => {},
    initSchema: {},
    shortCuts: [],
    utils: {}
  };
  constructor(props) {
    super(props);
    this.appHelper = props.appHelper || new AppHelper();
    if (!this.appHelper.schemaHelper) {
      this.appHelper.set('schemaHelper', new SchemaHelper(props.initSchema || {}, this.appHelper));
    }
    this.appHelper.set('basicSchemaHelper', this.appHelper.schemaHelper);
    if (!this.appHelper.dndHelper) {
      this.appHelper.set('dndHelper', new DndHelper(this.appHelper));
    }
    this.appHelper.dndHelper.setCanvasWin(window);
    if (this.appHelper.designMode === undefined) {
      this.appHelper.designMode = 'extend';
    }

    this.canvasAppHelper = new AppHelper({
      history: this.appHelper.history,
      location: this.appHelper.location,
      match: this.appHelper.match
    });

    this.updateCanvasAppHelper(props);
    this.appHelper.once('ide.ready', () => {
      this.updateCanvasAppHelper(props);
    });

    window.__ctx = {
      appHelper: this.appHelper,
      canvasAppHelper: this.canvasAppHelper,
      components: this.props.components
    };

    window.goldlog = window.goldlog || window.parent.goldlog;

    this.state = {
      canvasStack: [
        {
          lunaKey: 'root',
          lunaPath: '',
          name: 'root',
          schemaHelper: this.appHelper.schemaHelper,
          schema: this.appHelper.schemaHelper.get('schema')
        }
      ]
    };
    this.appHelper.set('canvasStack', this.state.canvasStack);
  }

  componentDidMount() {
    const appHelper = this.appHelper;
    appHelper.batchOn(['behavior.undo', 'behavior.redo'], this.handleUndoRedo);
    appHelper.on('schema.reset', this.handleSchemaReset);
    appHelper.on('material.move', this.handleMaterialMove);
    appHelper.on('material.add', this.handleMaterialAdd);
    appHelper.on('material.remove', this.handleMaterialRemove);
    appHelper.on('material.up', this.handleMaterialMoveUp);
    appHelper.on('material.down', this.handleMaterialMoveDown);
    appHelper.on('material.copy', this.handleMaterialCopy);
    appHelper.on('material.update', this.handleMaterialUpdate);
    appHelper.on('material.select', this.handleMaterialSelect);
    appHelper.on('schemaHelper.schema.afterUpdate', this.handleReset);
    appHelper.on('designMode.change', this.handleDesignModeChange);
    appHelper.on('preview.change', this.handlePreviewChange);
    appHelper.on('canvas.stack.push', this.handleCanvasPush);
    appHelper.on('canvas.stack.pop', this.handleCanvasPop);
    appHelper.on('canvas.stack.jump', this.handleCanvasJump);
    appHelper.on('style.update', this.updateStyle);
    appHelper.batchOn(['utils.update', 'constants.update', 'componentsMap.update'], this.handleCanvasAppHelperUpdate);
    appHelper.on('viewPort.update', this.handleForceUpdate);

    registShortCuts(this.props.shortCuts, this.appHelper);
    this.appHelper.set('canvas', this);
    this.props.onCreate(this.appHelper);
    appHelper.emit('canvas.ready', this);
    goldlog(
      'EXP',
      {
        action: 'appear'
      },
      'canvas'
    );
  }

  componentWillUnmount() {
    const appHelper = this.appHelper;
    appHelper.batchOff(['behavior.undo', 'behavior.redo'], this.handleUndoRedo);
    appHelper.on('schema.reset', this.handleSchemaReset);
    appHelper.off('material.move', this.handleMaterialMove);
    appHelper.off('material.add', this.handleMaterialAdd);
    appHelper.off('material.remove', this.handleMaterialRemove);
    appHelper.off('material.up', this.handleMaterialMoveUp);
    appHelper.off('material.down', this.handleMaterialMoveDown);
    appHelper.off('material.copy', this.handleMaterialCopy);
    appHelper.off('material.update', this.handleMaterialUpdate);
    appHelper.off('material.select', this.handleMaterialSelect);
    appHelper.off('schemaHelper.schema.afterUpdate', this.handleReset);
    appHelper.off('designMode.change', this.handleDesignModeChange);
    appHelper.off('preview.change', this.handlePreviewChange);
    appHelper.off('canvas.stack.push', this.handleCanvasPush);
    appHelper.off('canvas.stack.pop', this.handleCanvasPop);
    appHelper.off('canvas.stack.jump', this.handleCanvasJump);
    appHelper.off('style.update', this.updateStyle);
    appHelper.batchOff(['utils.update', 'constants.update', 'componentsMap.update'], this.handleCanvasAppHelperUpdate);
    appHelper.off('viewPort.update', this.handleForceUpdate);
    unRegistShortCuts(this.props.shortCuts);
  }

  // 消息处理

  handleMaterialMove = ({ lunaKey, targetKey, direction }) => {
    const appHelper = this.appHelper;
    appHelper.schemaHelper.move(lunaKey, targetKey, direction);
    appHelper.emit('behavior.record');
  };

  handleMaterialAdd = ({ schema, targetKey, direction }) => {
    if (!isSchema(schema)) {
      throw new Error('物料schema结构异常，无法添加！');
    }
    const appHelper = this.appHelper;
    const addSchema = Array.isArray(schema) ? schema[0] : schema;
    // 对于没有设置文件名的容器组件，交给画布外层处理
    if (isFileSchema(addSchema) && !addSchema.fileName) {
      return appHelper.emit('onFileNameMaterial.add', { schema: addSchema, targetKey, direction });
    }

    const addKey = appHelper.schemaHelper.add(schema, targetKey, direction);
    appHelper.emit('behavior.record');
    this.autoSelectComponent(addKey);
  };

  handleMaterialRemove = lunaKey => {
    const appHelper = this.appHelper;
    const schemaHelper = appHelper.schemaHelper;
    const currCompSchema = schemaHelper.schemaMap[lunaKey];
    // 获取当前删除物料的相邻物料
    const nextCompSchema = jsonuri.get(
      schemaHelper.schema,
      currCompSchema.__ctx.lunaPath.replace(/\/(\d+)$/, (res, idx) => `/${parseInt(idx) + 1}`)
    );
    const activeKey = (nextCompSchema && nextCompSchema.__ctx.lunaKey) || currCompSchema.__ctx.parentKey;
    appHelper.schemaHelper.remove(lunaKey);
    appHelper.emit('behavior.record');
    this.autoSelectComponent(activeKey);
  };

  handleMaterialMoveUp = lunaKey => {
    const appHelper = this.appHelper;
    appHelper.schemaHelper && appHelper.schemaHelper.slide(lunaKey, 'up');
    appHelper.emit('behavior.record');
  };

  handleMaterialMoveDown = lunaKey => {
    const appHelper = this.appHelper;
    appHelper.schemaHelper && appHelper.schemaHelper.slide(lunaKey, 'down');
    appHelper.emit('behavior.record');
  };

  handleMaterialCopy = lunaKey => {
    const appHelper = this.appHelper;
    const addKey = appHelper.schemaHelper.copy(lunaKey);

    appHelper.emit('behavior.record');
    this.autoSelectComponent(addKey);
  };

  handleMaterialUpdate = ({ lunaKey, props, propsKey }) => {
    const appHelper = this.appHelper;
    appHelper.schemaHelper.update(lunaKey, props);
    appHelper.emit('behavior.record', { lunaKey, propsKey });
  };

  handleMaterialSelect = (lunaKey, options) => {
    const appHelper = this.appHelper;
    if (appHelper.activeKey === lunaKey) return;
    appHelper.set('activeKey', lunaKey);
    appHelper.emit('material.select.change', lunaKey, options);
    const preNode = document.querySelectorAll('[data-active=true]');
    if (preNode[0] && preNode[0].dataset.lunaKey === lunaKey) return;
    (preNode || []).forEach(item => {
      item.removeAttribute('data-active');
      item.removeAttribute('data-nochild');
    });
    //判断是否容器组件且没有子元素
    if (!lunaKey) {
      window.parent.t = window.t = null;
      return;
    }
    let schema = appHelper.schemaHelper.schemaMap[lunaKey];
    if (!schema) return;
    let componentInfo = appHelper.componentsMap[schema.componentName];
    const currentNode = document.querySelectorAll(`[data-luna-key=${lunaKey}]`);
    (currentNode || []).forEach(item => {
      item.setAttribute('data-active', 'true');
      if (componentInfo && componentInfo.isContainer && schema && (!schema.children || !schema.children.length)) {
        item.setAttribute('data-nochild', 'true');
      }
    });
    // for debug
    let ctx = this.appHelper.schemaHelper.compCtxMap[lunaKey];
    let ref = this.appHelper.schemaHelper.compThisMap[lunaKey];
    let t = {
      ctx,
      schema,
      ref
    };
    t.__proto__ = ctx;
    window.parent.t = window.t = t;
  };

  handleDesignModeChange = designMode => {
    this.appHelper.set('designMode', designMode);
    this.forceUpdate();
  };

  handlePreviewChange = isPreview => {
    this.appHelper.set('isPreview', isPreview);
    this.forceUpdate();
  };

  handleUndoRedo = schema => {
    this.appHelper.schemaHelper.reset(schema);
    this.autoSelectComponent();
  };

  handleSchemaReset = schema => {
    this.appHelper.schemaHelper.reset(schema);
    this.appHelper.emit('behavior.record');
    this.autoSelectComponent();
  };

  handleReset = () => {
    this.updateCanvasStack();
    this.forceUpdate();
    this.updateStyle();
  };

  handleCanvasAppHelperUpdate = () => {
    this.updateCanvasAppHelper();
    this.forceUpdate();
  };

  handleForceUpdate = () => {
    this.forceUpdate();
  };

  handleCanvasPush = ({ schema, lunaKey, name }) => {
    const appHelper = this.appHelper;
    appHelper.emit('canvas.stack.beforePush');
    const { canvasStack } = this.state;
    const tempSchema = {
      componentName: 'Temp',
      fileName: 'temp',
      props: {},
      children: isJSSlot(schema) ? schema.value : schema //兼容slot
    };
    const schemaHelper = new SchemaHelper(transformSchemaToPure(tempSchema), this.appHelper);
    const schemaMap = this.appHelper.schemaHelper.schemaMap || {};
    const compCtxMap = this.appHelper.schemaHelper.compCtxMap || {};
    const currentComp = schemaMap[lunaKey];
    const undoRedoKey = `${lunaKey}_${canvasStack.length}`;
    //若是第一层下钻需要先给最上层加上从appHelper中获取的undoRedoKey
    if (canvasStack.length === 1) {
      canvasStack[0].undoRedoKey = this.appHelper.undoRedoKey;
    }
    const currentData = {
      lunaKey,
      lunaPath: currentComp.__ctx.lunaPath,
      name,
      schema,
      schemaHelper,
      ctx: compCtxMap[lunaKey],
      undoRedoKey,
      componentName: currentComp.componentName
    };
    appHelper.set('schemaHelper', schemaHelper);
    appHelper.undoRedoHelper && appHelper.undoRedoHelper.create(undoRedoKey, tempSchema);
    appHelper.set('undoRedoKey', undoRedoKey);
    appHelper.set('activeKey', null);
    this.setState(
      {
        canvasStack: [...this.state.canvasStack, currentData]
      },
      () => {
        this.appHelper.set('canvasStack', this.state.canvasStack);
        this.appHelper.emit('canvas.stack.afterPush', currentData, this.state.canvasStack);
        this.autoSelectComponent();
      }
    );
  };

  handleCanvasPop = () => {
    const { canvasStack } = this.state;
    if (canvasStack.length > 1) {
      this.handleCanvasJump(null, true);
    }
  };

  handleCanvasJump = (idx, isPop) => {
    const { canvasStack } = this.state;
    const appHelper = this.appHelper;
    let preIdx = idx + 1;
    if (isPop) {
      appHelper.emit('canvas.stack.beforePop');
      preIdx = canvasStack.length - 1;
      idx = preIdx - 1;
    } else {
      appHelper.emit('canvas.stack.beforeJump');
    }
    if (idx < 0 || idx > canvasStack.length - 1) return;
    const preData = canvasStack[preIdx];
    const currentData = canvasStack[idx];
    appHelper.set('schemaHelper', currentData.schemaHelper);
    appHelper.set('undoRedoKey', currentData.undoRedoKey);
    appHelper.undoRedoHelper && appHelper.undoRedoHelper.delete(preData.undoRedoKey);
    this.setState(
      {
        canvasStack: canvasStack.slice(0, idx + 1)
      },
      () => {
        appHelper.set('canvasStack', this.state.canvasStack);
        appHelper.schemaHelper.reset(appHelper.schemaHelper.schema);
        appHelper.emit('behavior.record');
        appHelper.emit(`canvas.stack.${isPop ? 'afterPop' : 'afterJump'}`, preData, this.state.canvasStack);
        this.autoSelectComponent(preData.lunaKey);
      }
    );
  };

  // 引擎处理函数

  handleCompGetCtx = (schema, ctx) => {
    const lunaKey = schema && schema.__ctx && schema.__ctx.lunaKey;
    if (!lunaKey) return;
    // console.log('+++++ getCtx', lunaKey, ctx);
    this.appHelper.schemaHelper.compCtxMap[lunaKey] = ctx;
    // for debug
    if (this.appHelper.activeKey && lunaKey === this.appHelper.activeKey) {
      let ref = this.appHelper.schemaHelper.compThisMap[lunaKey];
      let t = {
        ctx,
        schema,
        ref
      };
      t.__proto__ = ctx;
      window.parent.t = window.t = t;
    }
  };

  handleCompGetRef = (schema, ref, topLevel) => {
    const lunaKey = schema && schema.__ctx && schema.__ctx.lunaKey;
    if (!lunaKey) return;
    // console.log('----- getRef', lunaKey, ref);
    const schemaHelper = this.appHelper.schemaHelper;
    schemaHelper.compThisMap[lunaKey] = ref;
    if (ref && !ref.__design) {
      this.updateDesignMode(ref, schema, topLevel);
      const didUpdate = ref.componentDidUpdate;
      ref.componentDidUpdate = (...args) => {
        didUpdate && didUpdate.apply(ref, args);
        this.updateDesignMode(ref, schema, topLevel);
      };
      const willUnmount = ref.componentWillUnmount;
      ref.componentWillUnmount = (...args) => {
        willUnmount && willUnmount.apply(ref, args);
        // console.log('----- destroy', lunaKey, ref);
        delete schemaHelper.compThisMap[lunaKey];
        delete schemaHelper.compCtxMap[lunaKey];
      };
      ref.__design = true;
    }
  };

  handleDnd = (type, ev, schema) => {
    const lunaKey = schema && schema.__ctx && schema.__ctx.lunaKey;
    const designMode = this.appHelper.designMode;
    if (!lunaKey || ![DESIGN_MODE.EXTEND, DESIGN_MODE.BORDER].includes(designMode)) return;
    const dndHelper = this.appHelper && this.appHelper.dndHelper;
    if (dndHelper) {
      dndHelper[`handle${type}`](ev, lunaKey);
    }
  };

  //自动选中组件
  autoSelectComponent = lunaKey => {
    const appHelper = this.appHelper;
    // 若未指定需要选中的组件，且当前有选中的组件不做处理
    if (appHelper.activeKey && !lunaKey) return;
    if (!lunaKey) {
      // 若没有指定的组件，且当前又没有选中组件，默认选中顶部组件，如果是下钻编辑则默认选中第一个子组件
      const schema = appHelper.schemaHelper.schema;
      if (schema) {
        if (schema.componentName === 'Temp') {
          lunaKey = schema.children && schema.children[0] && schema.children[0].__ctx.lunaKey;
        } else {
          lunaKey = schema.__ctx.lunaKey;
        }
      }
    }
    appHelper.emit('material.select', lunaKey);
  };

  // 构造低代码组件
  generateLowComps = (props = this.props) => {
    const { components } = props;
    const { utils, constants } = this.canvasAppHelper || {};
    const componentsMap = this.appHelper.componentsMap || {};
    Object.keys(componentsMap).forEach(key => {
      const comp = componentsMap[key];
      // 对自定义组件做特殊处理
      if (comp.version === '0.0.0' && comp.code) {
        let schema = parseObj(comp.code);
        if (isFileSchema(schema) && schema.componentName === 'Component') {
          components[comp.name] = CompFactory(schema, components, componentsMap, {
            utils,
            constants
          });
        }
      }
    });
    return components;
  };

  updateCanvasAppHelper = (props = this.props) => {
    const { utils } = props;
    const { entityInfo = {}, componentsMap } = this.appHelper;
    this.canvasAppHelper.set({
      componentsMap,
      utils: entityInfo.utils ? generateUtils(utils, parseObj(entityInfo.utils)) : utils,
      constants: parseObj((entityInfo && entityInfo.constants) || {})
    });
    this.canvasAppHelper.set('components', this.generateLowComps(props));
  };

  updateStyle = () => {
    const entityInfo = this.appHelper.entityInfo || {};
    const blockSchemaMap = (this.appHelper.schemaHelper && this.appHelper.schemaHelper.blockSchemaMap) || {};
    const componentsMap = this.appHelper.componentsMap || {};
    const cssMap = {};
    // 区块中的样式
    Object.keys(blockSchemaMap).forEach(item => {
      const schema = blockSchemaMap[item];
      cssMap[schema.fileName] = schema.css || (schema.__ctx && schema.__ctx.css) || '';
    });
    // 低代码自定义组件中的样式
    Object.keys(componentsMap).forEach(item => {
      const comp = componentsMap[item];
      // 对自定义组件做特殊处理
      if (comp.version === '0.0.0' && comp.code && comp.css) {
        cssMap[comp.name] = comp.css;
      }
    });
    cssMap.__global = entityInfo.css || '';
    if (shallowEqual(this.cacheCssMap, cssMap)) return;
    this.cacheCssMap = cssMap;
    const { __global, ...other } = cssMap;
    addCssTag(
      'luna-canvas-style',
      `${__global}\n${Object.keys(other || {})
        .map(item => cssMap[item])
        .join('\n')}`
    );
  };

  updateCanvasStack = () => {
    const { canvasStack } = this.state;
    if (canvasStack.length < 2) return;
    for (let idx = canvasStack.length - 1; idx > 0; idx--) {
      const currentData = canvasStack[idx];
      const { lunaPath, name, schemaHelper, schema } = currentData;
      const preData = canvasStack[idx - 1];
      let data = schemaHelper.getPureSchema().children;
      // 如果情况内容则删除属性
      if (isEmpty(data)) {
        jsonuri.rm(
          preData.schemaHelper.schema,
          name === 'children' ? `${lunaPath}/children` : `${lunaPath}/props/${name.replace('.', '/')}`
        );
        continue;
      }
      if (isJSSlot(schema)) {
        data = {
          ...schema,
          value: data
        };
      } else if (name !== 'children') {
        data = {
          type: 'JSSlot',
          value: data
        };
      }
      jsonuri.set(
        preData.schemaHelper.schema,
        name === 'children' ? `${lunaPath}/children` : `${lunaPath}/props/${name.replace('.', '/')}`,
        data
      );
    }
  };

  updateDesignMode = (ref, schema, topLevel) => {
    if (!ref || (ref && ref.current === null) || !schema.__ctx) return;
    const { engine } = this.props;
    const appHelper = this.appHelper;
    const { activeKey, isPreview, viewPortConfig } = appHelper;
    const designMode = isPreview ? 'preview' : appHelper.designMode;
    const node = engine.findDOMNode(ref.current || ref);

    if (!node || !node.getAttribute) return;
    // 渲染引擎可以通过设置__disableDesignMode属性的方式阻止组件的可视模式；
    const hasDesignMode =
      [DESIGN_MODE.EXTEND, DESIGN_MODE.BORDER].includes(designMode) && !ref.props.__disableDesignMode;
    node.setAttribute('data-design-mode', designMode && hasDesignMode ? `luna-design-${designMode}` : '');
    if (topLevel) {
      node.setAttribute('top-container', true);
    }
    const lunaKey = schema.__ctx.lunaKey;
    let instanceName = schema.componentName + (window.parent.__isDebug ? (lunaKey || '_').split('_')[1] : '');
    switch (schema.componentName) {
      case 'Page':
        instanceName = '页面容器 ' + instanceName;
        break;
      case 'Block':
        instanceName = '区块容器 ' + instanceName;
        break;
      case 'Component':
        instanceName = '低代码组件容器 ' + instanceName;
        break;
      case 'Addon':
        instanceName = '插件容器 ' + instanceName;
        break;
      case 'Temp':
        instanceName = '下钻编辑器容器';
    }

    if (topLevel && viewPortConfig) {
      node.style.transform = `scale(${viewPortConfig.scale ? viewPortConfig.scale / 100 : 1})`;
    }
    node.setAttribute('data-instance-name', instanceName);
    node.setAttribute('data-luna-key', lunaKey);
    node.setAttribute('data-luna-path', schema.__ctx.lunaPath);

    if (hasDesignMode) {
      if (activeKey && activeKey === lunaKey) {
        node.setAttribute('data-active', true);
      } else {
        node.removeAttribute('data-active');
      }
      // 点击
      if (!node.compEvent && schema.componentName !== 'Temp') {
        node.compEvent = ev => {
          ev.stopPropagation();
          appHelper.emit('material.select', lunaKey, { isFromCanvas: true });
        };
        on(node, 'mousedown', node.compEvent, false);
      }

      // drag and drop
      if (!node.draggableFlag) {
        if (topLevel) {
          node.ondragleave = ev => this.handleDnd('DragLeave', ev, schema);
          node.ondrop = ev => this.handleDnd('Drop', ev, schema);
        } else {
          node.setAttribute('draggable', 'true');
          node.ondragstart = ev => this.handleDnd('DragStart', ev, schema);
          node.ondragend = ev => this.handleDnd('DragEnd', ev, schema);
        }
        node.ondragover = ev => this.handleDnd('DragOver', ev, schema);
        node.draggableFlag = true;
      }
    } else {
      //点击
      if (node.compEvent) {
        off(node, 'mousedown', node.compEvent, false);
        delete node.compEvent;
      }
      //drag and drop
      if (node.draggableFlag) {
        node.removeAttribute('draggable');
        delete node.ondragstart;
        delete node.ondragover;
        delete node.ondragend;
        delete node.ondragleave;
        delete node.ondrop;
        delete node.draggableFlag;
      }
    }
  };

  renderCanvasStack = () => {
    const { canvasStack } = this.state;
    const lastIndex = canvasStack.length - 1;
    const appHelper = this.appHelper;
    const canvasAppHelper = this.canvasAppHelper;
    const designMode = appHelper.isPreview ? 'preview' : appHelper.designMode;
    const Engine = this.props.engine;

    return (canvasStack || []).map((item, idx) => (
      <div
        className={classNames(
          'engine-wrapper',
          designMode,
          item.schemaHelper.schema &&
            item.schemaHelper.schema.props.style && {
              'fixed-width': item.schemaHelper.schema.props.style.width,
              'fixed-height': item.schemaHelper.schema.props.style.height
            }
        )}
        key={`${item.lunaKey}_${item.name}`}
      >
        <Engine
          schema={item.schemaHelper.schema}
          __ctx={item.ctx}
          designMode={designMode}
          appHelper={canvasAppHelper}
          components={canvasAppHelper.components}
          componentsMap={appHelper.componentsMap}
          suspended={idx !== lastIndex}
          onCompGetCtx={this.handleCompGetCtx}
          onCompGetRef={this.handleCompGetRef}
        />
      </div>
    ));
  };

  render() {
    const { canvasStack } = this.state;
    const lastIndex = canvasStack.length - 1;
    const schema = canvasStack[lastIndex] && canvasStack[lastIndex].schemaHelper.schema;

    const appHelper = this.appHelper;
    const { entityInfo = {}, viewPortConfig = {}, canvasPlaceholder = {} } = appHelper;
    const components = this.canvasAppHelper.components || {};

    const placeholder = { ...DEFAULT_PLACEHOLDER, ...canvasPlaceholder };
    const layoutComp = entityInfo.layoutInfo && entityInfo.layoutInfo.name;
    const layoutProps = (entityInfo.layoutInfo && entityInfo.layoutInfo.realProps) || {};
    const Layout = layoutComp && components[layoutComp];
    const { hideLayout } = viewPortConfig;
    const isDrillDown = canvasStack && canvasStack.length > 1;
    const isSchemaEmpty = isSchema(schema) && isEmpty(schema.children);
    const isSchemaNull = schema === null;
    const canvasStyle = {};
    if (!isDrillDown) {
      if (isSchemaEmpty) {
        canvasStyle.backgroundImage = `url(${placeholder.emptyImage})`;
      } else if (isSchemaNull) {
        canvasStyle.backgroundImage = `url(${placeholder.nullImage})`;
      }
    }
    return (
      <div
        className={classNames('luna-canvas-inner', {
          empty: isSchemaEmpty,
          null: isSchemaNull,
          'drill-down': isDrillDown
        })}
        style={canvasStyle}
        data-placeholder-text={isSchemaEmpty ? placeholder.emptyText : isSchemaNull ? placeholder.nullText : ''}
      >
        {Layout && !hideLayout ? (
          <Layout location={appHelper.location} history={appHelper.history} {...layoutProps}>
            {this.renderCanvasStack()}
          </Layout>
        ) : (
          this.renderCanvasStack()
        )}
      </div>
    );
  }
}
