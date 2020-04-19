function getStylePoint(id, level) {
  if (stylePointTable[id]) {
    return stylePointTable[id];
  }

  const base = getBasePoint();

  if (id === 'base') {
    return base;
  }

  const point = new StylePoint(id, level || 2000);
  if (level >= base.level) {
    let prev = base;
    let next = prev.next;
    while (next && level >= next.level) {
      prev = next;
      next = prev.next;
    }
    prev.next = point;
    point.prev = prev;
    if (next) {
      point.next = next;
      next.prev = point;
    }
  } else {
    let next = base;
    let prev = next.prev;
    while (prev && level < prev.level) {
      next = prev;
      prev = next.prev;
    }
    next.prev = point;
    point.next = next;
    if (prev) {
      point.prev = prev;
      prev.next = point;
    }
  }
  point.insert();
  stylePointTable[id] = point;

  return point;
}

const stylePointTable = {};

function getBasePoint() {
  if (!stylePointTable.base) {
    stylePointTable.base = new StylePoint('base', 1000);
    stylePointTable.base.insert();
  }
  return stylePointTable.base;
}

class StylePoint {
  constructor(id, level, placeholder) {
    this.lastContent = null;
    this.lastUrl = null;
    this.next = null;
    this.prev = null;
    this.id = id;
    this.level = level;
    if (placeholder) {
      this.placeholder = placeholder;
    } else {
      this.placeholder = document.createTextNode('');
    }
  }

  insert() {
    if (this.next) {
      document.head.insertBefore(this.placeholder, this.next.placeholder);
    } else if (this.prev) {
      document.head.insertBefore(this.placeholder, this.prev.placeholder.nextSibling);
    } else {
      document.head.appendChild(this.placeholder);
    }
  }

  applyText(content) {
    if (this.lastContent === content) {
      return;
    }
    this.lastContent = content;
    this.lastUrl = undefined;
    const element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.setAttribute('data-for', this.id);
    element.appendChild(document.createTextNode(content));
    document.head.insertBefore(element, this.placeholder);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
  }

  applyUrl(url) {
    if (this.lastUrl === url) {
      return;
    }
    this.lastContent = undefined;
    this.lastUrl = url;
    const element = document.createElement('link');
    element.href = url;
    element.rel = 'stylesheet';
    element.setAttribute('data-for', this.id);
    document.head.insertBefore(element, this.placeholder);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
  }
}

function loadCSS(url) {
  getStylePoint(url).applyUrl(url);
}

function isCSSUrl(url) {
  return /\.css$/.test(url);
}

function loadScript(url) {
  const node = document.createElement('script');

  // node.setAttribute('crossorigin', 'anonymous');

  node.onload = onload;
  node.onerror = onload;

  const i = {};
  const promise = new Promise((resolve, reject) => {
    i.resolve = resolve;
    i.reject = reject;
  });

  function onload(e) {
    node.onload = null;
    node.onerror = null;
    if (e.type === 'load') {
      i.resolve();
    } else {
      i.reject();
    }
    // document.head.removeChild(node);
    // node = null;
  }

  // node.async = true;
  node.src = url;

  document.head.appendChild(node);

  return promise;
}

export default function loadUrls(urls) {
  if (!urls || urls.length < 1) {
    return Promise.resolve();
  }

  let promise = null;
  urls.forEach((url) => {
    if (isCSSUrl(url)) {
      loadCSS(url);
    } else if (!promise) {
      promise = loadScript(url);
    } else {
      promise = promise.then(() => loadScript(url));
    }
  });

  return promise || Promise.resolve();
}
