import ReactDOM from 'react-dom';
import Debug from 'debug';
import { isFileSchema, isEmpty, throttle, deepEqual } from './index';
const DICT = {
  left: '左',
  right: '右',
  top: '上',
  bottom: '下',
  in: '里'
};
const TOP_COMPONENT = ['Page', 'Component', 'Temp']; // 顶端模块，不支持放置兄弟节点
const debug = Debug('utils:dndHelper');
export default class DndHelper {
  constructor(appHelper) {
    this.appHelper = appHelper;
    this.dragDom = null;
    this.canvasEffectDom = null;
    this.treeEffectDom = null;
    this.containrDom = null;
    this.sourceEntity = null;
    this.tempEntity = null;
    this.dragInfo = null;
    this.canvasClearTimer = null;
    this.treeClearTimer = null;
    this.isDragging = false;
    this.dragOverFunc = throttle(this.dragOverFunc, 50);
  }

  setCanvasWin(win) {
    this.canvasWin = win;
    if (this.canvasEffectDom) {
      this.canvasWin.document.body.appendChild(this.canvasEffectDom);
    }
  }

  emit(msg, ...args) {
    this.appHelper && this.appHelper.emit(msg, ...args);
  }

  dragOverFunc(ev, schemaOrNode, isTree) {
    if (!this.isDragging || !this.sourceEntity) return;
    const entity = isTree
      ? this.getTreeEntity(schemaOrNode, ev)
      : {
          target: ev.currentTarget,
          schema: schemaOrNode
        };
    if (this.sourceEntity.schema.__ctx && this.sourceEntity.schema.__ctx.lunaKey === entity.schema.__ctx.lunaKey)
      return;
    let dragInfo = null;
    if (isTree) {
      dragInfo = this.getTreeDragInfo(ev, entity);
    } else {
      dragInfo = this.getDragInfo(ev, entity);
    }
    if (!dragInfo || deepEqual(this.dragInfo, dragInfo)) return;
    this.dragInfo = dragInfo;
    this.tempEntity = dragInfo.entity;
    this.clearEffect(isTree);
    this.addEffect(isTree);
  }

  changeCanvas() {
    debug('change canvas', this.sourceEntity, this.tempEntity);
    if (!this.sourceEntity || !this.tempEntity) return;
    if (this.sourceEntity.isAdd) {
      debug('add material', this.sourceEntity.schema, this.tempEntity.schema.__ctx.lunaKey, this.dragInfo.position);
      this.emit('material.add', {
        schema: this.sourceEntity.schema,
        targetKey: this.tempEntity.schema.__ctx.lunaKey,
        direction: this.dragInfo.position
      });
    } else {
      this.emit('material.move', {
        lunaKey: this.sourceEntity.schema.__ctx.lunaKey,
        targetKey: this.tempEntity.schema.__ctx.lunaKey,
        direction: this.dragInfo.position
      });
    }
  }

  getTreeEntity(node, ev) {
    if (!node) return;
    const schemaHelper = this.appHelper.schemaHelper;
    const lunaKey = node.props.eventKey;
    const schema = schemaHelper.schemaMap[lunaKey];
    if (!schema) return;
    const ref = schemaHelper.compThisMap[lunaKey];
    const currentTarget = ev.currentTarget;
    return {
      schema,
      target: ref && ReactDOM.findDOMNode(ref),
      treeNodeTarget: currentTarget
    };
  }

  getDragTagDom(tagName) {
    if (!this.dragDom) {
      const dragDom = document.createElement('div');
      dragDom.id = 'luna-drag-dom';
      dragDom.style.height = '24px';
      dragDom.style.position = 'absolute';
      dragDom.style.zIndex = 10000000;
      dragDom.style.transform = 'translateY(-10000px)';
      dragDom.style.background = 'rgba(0, 0, 0, .5)';
      dragDom.style.lineHeight = '24px';
      dragDom.style.color = '#fff';
      dragDom.style.padding = '0px 10px';
      dragDom.style.display = 'inline-block';
      document.body.appendChild(dragDom);
      this.dragDom = dragDom;
    }
    this.dragDom.innerHTML = `<i class="next-icon next-icon-zujianku next-small"></i> ${tagName}`;
    return this.dragDom;
  }

  getCanvasEffectDom() {
    if (!this.canvasWin) {
      throw new Error('should set the canvasWin first');
    }
    if (this.canvasClearTimer) {
      clearTimeout(this.canvasClearTimer);
      this.canvasClearTimer = null;
    }

    const { position } = this.dragInfo;
    let canvasEffectDom = this.canvasEffectDom;
    if (!canvasEffectDom) {
      canvasEffectDom = document.createElement('div');
      this.canvasWin.document.body.appendChild(canvasEffectDom);
      this.canvasEffectDom = canvasEffectDom;
    }
    canvasEffectDom.id = 'luna-canvas-effect';
    canvasEffectDom.innerHTML = `<b>${DICT[position]}</b>`;
    canvasEffectDom.className = position;
    canvasEffectDom.style.display = 'block';

    return canvasEffectDom;
  }

  getTreeEffectDom() {
    if (this.treeClearTimer) {
      clearTimeout(this.treeClearTimer);
      this.treeClearTimer = null;
    }
    let treeEffectDom = this.treeEffectDom;
    if (!treeEffectDom) {
      treeEffectDom = document.createElement('div');
      this.treeEffectDom = treeEffectDom;
    }
    treeEffectDom.id = 'luna-tree-effect';
    treeEffectDom.style.display = 'block';
    return treeEffectDom;
  }

  getLunaContainerDom(target) {
    if (!target) return null;
    let parent = target.parentNode;
    while (parent && (!parent.dataset || !parent.dataset.lunaKey)) {
      parent = parent.parentNode;
    }
    return parent;
  }

  clearCompTreeEffect() {
    const container = document.querySelector('.luna-comp-tree');
    if (!container) return;

    let treeItems = container.querySelectorAll('.tree-item');
    (treeItems || []).forEach(item => {
      const classList = item.classList;
      if (classList) {
        classList.remove('top');
        classList.remove('in');
        classList.remove('bottom');
        classList.remove('tree-item');
      }
    });
  }

  getDragInfo(ev, entity) {
    if (!this.sourceEntity || !entity) return null;
    const { target, schema } = entity;
    const sourcePath = this.sourceEntity.schema.__ctx && this.sourceEntity.schema.__ctx.lunaPath;
    const targetPath = schema.__ctx.lunaPath;
    const sourceTarget = this.sourceEntity.target;

    if (sourcePath === targetPath) return null;
    if (targetPath && targetPath.startsWith(sourcePath)) return null;
    const componentsMap = this.appHelper.get('componentsMap');
    // if (!componentsMap || !componentsMap[schema.componentName]) return null;
    let isContainer =
      (componentsMap[schema.componentName] && componentsMap[schema.componentName].isContainer) || isFileSchema(schema); //是否是容器组件
    if (schema.children && typeof schema.children !== 'object') {
      //如果children是文本, 非模型结构，则非容器；
      isContainer = false;
    }
    const rect = target.getBoundingClientRect();
    const isSupportIn =
      isContainer &&
      (!schema.children || (schema.children && typeof schema.children === 'object' && isEmpty(schema.children)));
    const sourceIsInline = sourceTarget && ['inline-block', 'inline'].includes(getComputedStyle(sourceTarget).display);
    const isInline = ['inline-block', 'inline'].includes(getComputedStyle(target).display) && sourceIsInline;
    const measure = isInline ? 'width' : 'height';

    let sn = 0;
    let position = 'top';
    if (isContainer) {
      sn = isSupportIn ? rect[measure] * 0.25 : Math.min(rect[measure] * 0.5, 10);
    } else {
      sn = rect[measure] * 0.5;
    }
    if (TOP_COMPONENT.includes(schema.componentName)) {
      // 顶端组件，拖拽over时，只能放在其内部
      position = 'in';
    } else if (isInline && !isContainer) {
      if (Math.abs(ev.clientX - rect.left) <= sn) {
        position = 'left';
      } else if (Math.abs(ev.clientX - rect.right) <= sn) {
        position = 'right';
      }
    } else {
      if (Math.abs(ev.clientY - rect.top) <= sn) {
        position = 'top';
      } else if (Math.abs(ev.clientY - rect.bottom) <= sn) {
        position = 'bottom';
      } else {
        position = 'in';
      }
    }

    // 判断是否是相邻元素, 往左|上拖
    const isPrevSibling = sourceTarget === target.nextElementSibling;
    if (isPrevSibling) {
      if (position === 'right') position = 'left';
      if (position === 'bottom') {
        position = isContainer ? 'in' : 'top';
      }
    }
    // 判断是否相邻元素，往右|下拖
    const isPostSibling = sourceTarget === target.previousElementSibling;
    if (isPostSibling) {
      if (position === 'left') position = 'right';
      if (position === 'top') {
        position = isContainer ? 'in' : 'bottom';
      }
    }

    //如果是容器组件，且包含有子组件，且是in状态，进行智能识别处理；
    let subChildren = [];
    const getChildren = node => {
      if (!node || !node.childNodes || node.childNodes.length === 0) return;
      node.childNodes.forEach(child => {
        if (child === sourceTarget) return;
        if (child && child.getAttribute && child.getAttribute('draggable')) {
          const isInline = ['inline', 'inline-block'].includes(getComputedStyle(child).display) && sourceIsInline;
          const rect = child.getBoundingClientRect();
          const l = Math.abs(ev.clientX - rect.left);
          const r = Math.abs(ev.clientX - rect.right);
          const t = Math.abs(ev.clientY - rect.top);
          const b = Math.abs(ev.clientY - rect.bottom);
          const minXDistance = Math.min(l, r);
          const minYDistance = Math.min(t, b);
          subChildren.push({
            lunaKey: child.dataset.lunaKey,
            node: child,
            minDistance: isInline ? [minXDistance, minYDistance] : [minYDistance, minXDistance],
            position: isInline ? (l > r ? 'right' : 'left') : b > t ? 'top' : 'bottom'
          });
        } else {
          getChildren(child);
        }
      });
    };
    if (position === 'in' && isContainer && !isSupportIn) {
      getChildren(target);
      subChildren = subChildren.sort((a, b) => {
        if (a.minDistance[0] === b.minDistance[0]) {
          return a.minDistance[1] - b.minDistance[1];
        }
        return a.minDistance[0] - b.minDistance[0];
      });
      const tempChild = subChildren[0];
      if (tempChild) {
        if (sourceTarget === tempChild.node.nextElementSibling && ['bottom', 'right'].includes(tempChild.position))
          return null;
        if (sourceTarget === tempChild.node.previousElementSibling && ['top', 'left'].includes(tempChild.position))
          return null;
        position = tempChild.position;
        entity = {
          target: tempChild.node,
          schema: this.appHelper.schemaHelper.schemaMap[tempChild.lunaKey]
        };
      }
    }

    const containrDom = position === 'in' ? entity.target : this.getLunaContainerDom(entity.target);
    if (this.containrDom !== containrDom) {
      if (this.containrDom) {
        this.containrDom.style.outline = '';
      }
      this.containrDom = containrDom;
    }
    if (this.containrDom) {
      containrDom.style.outline = '1px solid #1aab11';
    }
    // debug('drag info:', position, isSupportIn, isContainer, entity);
    return {
      position,
      isSupportIn,
      isContainer,
      entity
    };
  }

  getTreeDragInfo(ev, entity) {
    if (!this.sourceEntity || !entity) return null;
    const { schema, treeNodeTarget } = entity;
    const sourcePath = this.sourceEntity.schema.__ctx && this.sourceEntity.schema.__ctx.lunaPath;
    const targetPath = schema.__ctx.lunaPath;
    if (sourcePath === targetPath) return null;
    if (targetPath && targetPath.startsWith(sourcePath)) return null;
    const componentsMap = this.appHelper.get('componentsMap');
    // if (!componentsMap || !componentsMap[schema.componentName]) return null;
    let isContainer =
      (componentsMap[schema.componentName] && componentsMap[schema.componentName].isContainer) || isFileSchema(schema); //是否是容器组件
    if (schema.children && typeof schema.children !== 'object') {
      //如果children是文本, 非模型结构，则非容器；
      isContainer = false;
    }
    const rect = treeNodeTarget.getBoundingClientRect();
    const isSupportIn =
      isContainer &&
      (!schema.children || (schema.children && typeof schema.children === 'object' && isEmpty(schema.children)));

    const sn = isContainer && isSupportIn ? rect.height * 0.25 : rect.height * 0.5;
    let position = 'in';
    if (Math.abs(ev.clientY - rect.top) <= sn) {
      position = 'top';
    } else if (Math.abs(ev.clientY - rect.bottom) <= sn) {
      position = 'bottom';
    }
    return {
      position,
      isSupportIn,
      isContainer,
      entity
    };
  }

  addEffect(isTree) {
    if (!this.tempEntity) return;
    const { position } = this.dragInfo;
    const { target, treeNodeTarget } = this.tempEntity;
    // this.clearCompTreeEffect();
    if (isTree) {
      //画父元素外框
      let status = true;
      let node = treeNodeTarget.parentNode;
      while (status) {
        if (node && node.parentNode) {
          if (node.parentNode.tagName == 'LI' && node.parentNode.classList.contains('next-tree-node')) {
            status = false;
            if (this.treeNodeTargetParent !== node.parentNode || position === 'in') {
              this.treeNodeTargetParent && this.treeNodeTargetParent.classList.remove('selected');
            }
            this.treeNodeTargetParent = node.parentNode;
            if (position !== 'in') this.treeNodeTargetParent.classList.add('selected');
          } else {
            node = node.parentNode;
          }
        } else {
          status = false;
        }
      }
      treeNodeTarget.appendChild(this.getTreeEffectDom());
      this.treeEffectDom.className = position;
    } else {
      const effectDom = this.getCanvasEffectDom();
      const rect = target.getBoundingClientRect();
      effectDom.style.left = (position === 'right' ? rect.right : rect.left) + 'px';
      effectDom.style.top =
        (position === 'bottom' ? rect.bottom : position === 'in' ? (rect.top + rect.bottom) / 2 : rect.top) + 'px';
      effectDom.style.height = ['top', 'in', 'bottom'].includes(position) ? '2px' : rect.height + 'px';
      effectDom.style.width = ['left', 'right'].includes(position) ? '2px' : rect.width + 'px';
    }
  }

  clearCanvasEffect() {
    if (this.canvasEffectDom) {
      this.canvasEffectDom.style.display = 'none';
    }
    if (this.containrDom) {
      this.containrDom.style.outline = '';
    }
  }

  clearTreeEffect() {
    if (this.treeEffectDom) {
      this.treeEffectDom.style.display = 'none';
    }
    if (this.treeNodeTargetParent) {
      this.treeNodeTargetParent.classList.remove('selected');
    }
    const tempTarget = this.tempEntity && this.tempEntity.treeNodeTarget;
    const classList = tempTarget && tempTarget.classList;
    if (classList) {
      classList.remove('top');
      classList.remove('bottom');
      classList.remove('in');
      classList.remove('tree-item');
    }
  }

  clearEffect(isTree) {
    if (this.isDragging) {
      // if (isTree) {
      if (this.treeClearTimer) {
        clearTimeout(this.treeClearTimer);
        this.treeClearTimer = null;
      }
      this.treeClearTimer = setTimeout(() => {
        this.clearTreeEffect();
      }, 300);
      // } else {
      if (this.canvasClearTimer) {
        clearTimeout(this.canvasClearTimer);
        this.canvasClearTimer = null;
      }
      this.canvasClearTimer = setTimeout(() => {
        this.clearCanvasEffect();
      }, 300);
      // }
    } else {
      // if (isTree) {
      this.clearTreeEffect();
      // } else {
      this.clearCanvasEffect();
      // }
    }
  }

  handleDragStart(ev, lunaKey) {
    ev.stopPropagation();
    const target = ev.currentTarget;
    target.style.filter = 'blur(2px)';
    const schema = this.appHelper.schemaHelper.schemaMap[lunaKey];
    ev.dataTransfer.setDragImage(this.getDragTagDom(schema.componentName), 0, 0);
    this.sourceEntity = {
      target,
      schema
    };
    this.isDragging = true;
  }

  handleDragEnd(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.isDragging = false;
    if (!this.sourceEntity) return;
    if (this.sourceEntity.target) {
      this.sourceEntity.target.style.filter = '';
    }
    this.clearEffect();
  }

  handleDragOver(ev, lunaKey) {
    ev.preventDefault();
    ev.stopPropagation();
    this.isDragging = true;
    const schema = this.appHelper.schemaHelper.schemaMap[lunaKey];
    this.dragOverFunc(
      {
        clientX: ev.clientX,
        clientY: ev.clientY,
        currentTarget: ev.currentTarget
      },
      schema
    );
  }

  handleDragLeave(ev) {
    //避免移动到treeEffectDom上的抖动
    ev.stopPropagation();
    if (!this.tempEntity) return;
    const rect = ev.target.getBoundingClientRect();
    // 如果鼠标位置还在当前元素范围内则不认为是dragLeave
    if (ev.x >= rect.left && ev.x <= rect.right && ev.y >= rect.top && ev.y <= rect.bottom) return;
    debug('canvas drag leave', ev);
    this.clearEffect();
    this.dragInfo = null;
    this.isDragging = false;
  }

  handleDrop(ev) {
    ev.stopPropagation();
    debug('drop+++++');
    this.isDragging = false;
    this.changeCanvas();
    this.clearEffect();
  }

  handleTreeDragStart(ev) {
    const { event, node } = ev;
    event.stopPropagation();
    const lunaKey = node.props.eventKey;
    const schema = this.appHelper.schemaHelper.schemaMap[lunaKey];
    if (!schema) return;

    event.dataTransfer.setDragImage(this.getDragTagDom(schema.componentName), 0, 0);
    this.sourceEntity = this.getTreeEntity(node, event);
    if (this.sourceEntity.target) {
      this.sourceEntity.target.style.filter = 'blur(2px)';
    }
    this.isDragging = true;
  }

  handleTreeDragEnd(ev) {
    const { event } = ev;
    event.stopPropagation();
    event.preventDefault();
    this.isDragging = false;
    if (!this.sourceEntity) return;
    if (this.sourceEntity.target) {
      this.sourceEntity.target.style.filter = '';
    }
    this.clearEffect(true);
  }

  handleTreeDragOver(ev) {
    const { event, node } = ev;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
    this.dragOverFunc(
      {
        clientX: event.clientX,
        clientY: event.clientY,
        currentTarget: event.currentTarget.children[0]
      },
      node,
      true
    );
  }

  handleTreeDragLeave(ev) {
    const { event } = ev;
    event.stopPropagation();
    if (!this.tempEntity) return;
    //避免移动到treeEffectDom上的抖动
    if (this.treeEffectDom && this.treeEffectDom.parentNode.parentNode === event.currentTarget) return;
    debug('++++ drag leave tree', ev, this.isDragging);
    this.clearEffect(true);
    this.isDragging = false;
  }

  handleTreeDrop(ev) {
    const { event } = ev;
    event.stopPropagation();
    this.isDragging = false;
    this.changeCanvas();
    this.clearEffect(true);
  }

  handleResourceDragStart(ev, title, schema) {
    ev.stopPropagation();
    ev.dataTransfer.setDragImage(this.getDragTagDom(title), -2, -2);
    this.sourceEntity = {
      isAdd: true,
      schema
    };
    this.isDragging = true;
  }
}
