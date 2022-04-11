function resolveEdge(popup: any, target: any, arrow: any, bounds: any) {
  const sx = arrow.width > target.width ? (arrow.width - target.width) / 2 : 0;
  const sy = arrow.width > target.height ? (arrow.width - target.height) / 2 : 0;

  const top = Math.max(target.top - popup.height + arrow.width - sy, bounds.top);
  const right = Math.min(target.right + popup.width - arrow.width + sx, bounds.right);
  const bottom = Math.min(target.bottom + popup.height - arrow.width + sy, bounds.bottom);
  const left = Math.max(target.left - popup.width + arrow.width - sx, bounds.left);

  return { top, right, bottom, left };
}

function resolveDirection(popup: any, target: any, edge: any, bounds: any, prefers: any) {
  if (prefers.forceDirection) {
    return prefers.dir;
  }
  const extendWidth = popup.width + popup.extraOffset;
  const extendHeight = popup.height + popup.extraOffset;
  const SY = popup.width * extendHeight;
  const SX = popup.height * extendWidth;
  const mw = Math.min(edge.right - edge.left, popup.width);
  const mh = Math.min(edge.bottom - edge.top, popup.height);

  const mat: any = {
    top: () => {
      const s = mw * Math.min(target.top - bounds.top, extendHeight);
      return { s, enough: s >= SY };
    },
    bottom: () => {
      const s = mw * Math.min(bounds.bottom - target.bottom, extendHeight);
      return { s, enough: s >= SY };
    },
    left: () => {
      const s = mh * Math.min(target.left - bounds.left, extendWidth);
      return { s, enough: s >= SX };
    },
    right: () => {
      const s = mh * Math.min(bounds.right - target.right, extendWidth);
      return { s, enough: s >= SX };
    },
  };

  const orders = ['top', 'right', 'bottom', 'left'];
  if (prefers.dir) {
    const i = orders.indexOf(prefers.dir);
    if (i > -1) {
      orders.splice(i, 1);
      orders.unshift(prefers.dir);
    }
  }
  let ms = 0;
  let prefer = orders[0];
  for (let i = 0, l = orders.length; i < l; i++) {
    const dir = orders[i];
    const { s, enough } = mat[dir]();
    if (enough) {
      return dir;
    }
    if (s > ms) {
      ms = s;
      prefer = dir;
    }
  }
  return prefer;
}

function resolvePrefer(prefer: any, targetRect: any, bounds: any) {
  if (!prefer) {
    if (targetRect.left - bounds.left < 10) {
      return { dir: 'right' };
    } else if (targetRect.top - bounds.top < 10) {
      return { dir: 'bottom' };
    } else if (bounds.bottom - targetRect.bottom < 10) {
      return { dir: 'top' };
    } else if (bounds.right - targetRect.right < 10) {
      return { dir: 'left' };
    }
    return {};
  }
  const force = prefer[0] === '!';
  if (force) {
    prefer = prefer.slice(1);
  }
  let [dir, offset] = prefer.split(/\s+/);
  let forceDirection = false;
  let forceOffset = false;
  if (dir === 'center') {
    dir = 'auto';
    if (!offset) {
      offset = 'center';
    }
  }

  if (force) {
    if (dir && dir !== 'auto') {
      forceDirection = true;
    }
    if (offset && offset !== 'auto') {
      forceOffset = true;
    }
  }

  return { dir, offset, forceDirection, forceOffset };
}

export function resolvePosition(popup: any, target: any, arrow: any, bounds: any, prefer: any) {
  popup = {
    extraOffset: arrow.height,
    top: popup.top,
    right: popup.right,
    left: popup.left,
    bottom: popup.bottom,
    height: popup.height,
    width: popup.width,
  };

  const prefers = resolvePrefer(prefer, target, bounds);

  const edge = resolveEdge(popup, target, arrow, bounds);

  // 选择方向
  const dir = resolveDirection(popup, target, edge, bounds, prefers);

  let top;
  let left;
  let arrowTop;
  let arrowLeft;

  // 或得该方位上横向 或 纵向的 偏移
  if (dir === 'top' || dir === 'bottom') {
    if (dir === 'top') {
      top = target.top - popup.extraOffset - popup.height;
    } else {
      top = target.bottom + popup.extraOffset;
    }

    // 解决横向偏移
    const offset = arrow.width > target.width ? (arrow.width - target.width) / 2 : 0;
    const minLeft = target.left + arrow.width - offset - popup.width;
    const maxLeft = target.right - arrow.width + offset;
    const centerLeft = target.left - (popup.width - target.width) / 2;

    if (prefers.offset === 'left') {
      left = minLeft;
    } else if (prefers.offset === 'right') {
      left = maxLeft;
    } else {
      left = centerLeft;
    }

    if (!prefers.forceOffset) {
      left = Math.max(Math.min(edge.right - popup.width, left), minLeft);
      left = Math.min(Math.max(edge.left, left), maxLeft);
    }

    arrowLeft = Math.min(popup.width - arrow.width, Math.max(target.left - (arrow.width - target.width) / 2 - left, 0));
  } else {
    if (dir === 'left') {
      left = target.left - popup.extraOffset - popup.width;
    } else {
      left = target.right + popup.extraOffset;
    }

    // 解决纵向偏移
    const offset = arrow.width > target.height ? (arrow.width - target.height) / 2 : 0;
    const minTop = target.top + arrow.width - offset - popup.height;
    const maxTop = target.bottom - arrow.width + offset;
    const centerTop = target.top - (popup.height - target.height) / 2;

    if (prefers.offset === 'top') {
      top = minTop;
    } else if (prefers.offset === 'bottom') {
      top = maxTop;
    } else {
      top = centerTop;
    }

    if (!prefers.forceOffset) {
      top = Math.max(Math.min(edge.bottom - popup.height, top), minTop);
      top = Math.min(Math.max(edge.top, top), maxTop);
    }

    arrowTop = Math.min(popup.height - arrow.height, Math.max(target.top - (arrow.width - target.height) / 2 - top, 0));
  }

  return { dir, left, top, arrowLeft, arrowTop };
}

const percentPresets: any = {
  right: 1,
  left: 0,
  top: 0,
  bottom: 1,
  center: 0.5,
};

function isPercent(val: any) {
  return /^[\d.]+%$/.test(val);
}

function resolveRelativeValue(val: any, offset: any, total: any) {
  if (!val) {
    val = 0;
  } else if (isPercent(val)) {
    val = (parseFloat(val) / 100) * total;
  } else if (percentPresets.hasOwnProperty(val)) {
    val = percentPresets[val] * total;
  } else {
    val = parseFloat(val);
    if (isNaN(val)) {
      val = 0;
    }
  }

  return `${val + offset}px`;
}

export function resolveRelativePosition(align: any, popup: any, bounds: any) {
  if (!align) {
    // return default position
    return {
      top: '38.2%',
      left: 'calc(50% - 110px)',
    };
  }

  let [xAlign, yAlign] = align.trim().split(/\s+/);

  if (xAlign === 'top' || xAlign === 'bottom' || yAlign === 'left' || yAlign === 'right') {
    const tmp = xAlign;
    xAlign = yAlign;
    yAlign = tmp;
  }

  if (xAlign === 'center' && !yAlign) {
    yAlign = 'center';
  }

  return {
    left: resolveRelativeValue(xAlign, 0, bounds.right - bounds.left - popup.width),
    top: resolveRelativeValue(yAlign, 0, bounds.bottom - bounds.top - popup.height),
  };
}
