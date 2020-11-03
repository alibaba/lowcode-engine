import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icons, { Button } from '@ali/ve-icons';
import utils from '../utils';
import $i18n from '../i18n/index';

function diplayValue(value) {
  if (utils.isEmptyCssValue(value)) {
    return $i18n.get({ id: 'styleAir', dm: '空' });
  }

  const m = /^(.+)px/.exec(value);
  if (m) {
    return m[1];
  }

  return value;
}

class Input extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.select();
    }
  }

  render() {
    return (
      <input
        className="vs-inline-input-input"
        type="text"
        ref={(ref) => {
          this.input = ref;
        }}
        {...this.props}
      />
    );
  }
}

class InlineInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    inheritValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    onChange: PropTypes.func,
    negtive: PropTypes.bool,
    compute: PropTypes.func,
    highlight: PropTypes.bool,
  };

  static defaultProps = {
    compute() {
      return '0px';
    },
    highlight: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      editing: false,
    };

    this.pattern = this.props.negtive
      ? /^(-?\d+(?:\.\d+)?)(px|rem|em|%|pt)?$|^auto$/i
      : /^(\d+(?:\.\d+)?)(px|rem|em|%|pt)?$|^auto$/i;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: utils.isEmptyCssValue(nextProps.value) ? '' : nextProps.value });
    }
  }

  setValue(value) {
    this.setState({ value });
    if (this.isValid(value) && this.props.onChange) {
      this.props.onChange(value.trim());
    }
  }

  isValid(value) {
    return value.trim() === '' || this.pattern.test(value);
  }

  keyDown(e) {
    if (e.keyCode === 27 || e.keyCode === 13) {
      this.exitEdit();
      e.preventDefault();
      return;
    }
    if (e.keyCode !== 38 && e.keyCode !== 40) {
      return;
    }
    e.preventDefault();

    const factor = e.keyCode === 40 ? -1 : 1;
    let value = e.target.value.trim();
    if (!this.isValid(value)) {
      value = utils.isEmptyCssValue(this.props.value) ? this.props.inheritValue : this.props.value;
    }

    if (utils.isEmptyCssValue(value) || value.toLowerCase() === 'auto') {
      value = this.props.compute(value);
    }

    const m = this.pattern.exec(value);
    if (!m[1]) return;
    let n = parseFloat(m[1]) + factor;
    if (!this.props.negtive && n < 0) {
      n = 0;
    }
    this.setValue(`${n}${m[2] || 'px'}`);
  }

  exitEdit() {
    if (!/\D+$/.test(this.state.value)) {
      this.setValue(`${this.state.value}px`);
    } else if (!this.pattern.test(this.state.value)) {
      this.setValue(`${/\d+/.exec(this.state.value)[0]}px`);
    }

    this.setState({
      editing: false,
    });
  }

  enterEdit() {
    this.setState({
      editing: true,
      value: utils.isEmptyCssValue(this.props.value) ? '' : this.props.value,
    });
  }

  render() {
    const { value, inheritValue, highlight } = this.props;
    const className = classNames('vs-inline-input', this.props.className, {
      've-highlight': highlight,
    });

    const display = diplayValue(utils.isEmptyCssValue(value) ? inheritValue : value);

    return (
      <div className={className}>
        {!this.state.editing && (
          <span className="vs-inline-input-text" onClick={this.enterEdit.bind(this)}>
            {display}
          </span>
        )}
        {this.state.editing && (
          <Input
            value={this.state.value}
            placeholder={inheritValue}
            onChange={e => this.setValue(e.target.value)}
            onKeyDown={this.keyDown.bind(this)}
            onBlur={this.exitEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}

function spliteMargin(all) {
  if (!all) {
    return {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };
  }
  let [top, right, bottom, left] = all.trim().split(/\s+/); // eslint-disable-line
  if (utils.isEmptyCssValue(right)) {
    right = top;
  }
  if (utils.isEmptyCssValue(bottom)) {
    bottom = top;
  }
  if (utils.isEmptyCssValue(left)) {
    left = right;
  }
  return {
    top, right, bottom, left,
  };
}

function compositeMargin(all, top, right, bottom, left) {
  const ret = spliteMargin(all);

  if (!utils.isEmptyCssValue(top)) {
    ret.top = top;
  }
  if (!utils.isEmptyCssValue(right)) {
    ret.right = right;
  }
  if (!utils.isEmptyCssValue(bottom)) {
    ret.bottom = bottom;
  }
  if (!utils.isEmptyCssValue(left)) {
    ret.left = left;
  }

  return ret;
}

function isFull(box) {
  return (
    !utils.isEmptyCssValue(box.top)
    && !utils.isEmptyCssValue(box.right)
    && !utils.isEmptyCssValue(box.bottom)
    && !utils.isEmptyCssValue(box.left)
  );
}

class LayoutBox extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    negtive: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.pattern = this.props.negtive
      ? /^(-?\d+(?:\.\d+)?)(px|rem|em|%|pt)?$|^auto$/i
      : /^(\d+(?:\.\d+)?)(px|rem|em|%|pt)?$|^auto$/i;
  }

  componentDidMount() {
    this.shell.addEventListener('mousedown', (e) => {
      // todo: dragging & interval add
      const t = e.target;
      if (t.dataset && t.dataset.handle) {
        this.add(t.dataset.handle);
      }
    });
  }

  add(dir, factor = 1) {
    if (!this.current || !this.inherit) return;
    let value = utils.isEmptyCssValue(this.current[dir]) ? this.inherit[dir] : this.current[dir];

    if (utils.isEmptyCssValue(value) || value.toLowerCase() === 'auto') {
      value = this.compute(dir);
    }

    const m = this.pattern.exec(value);
    if (!m[1]) return;
    let n = parseFloat(m[1]) + factor;
    if (!this.props.negtive && n < 0) {
      n = 0;
    }
    this.change(this.current, dir, `${n}${m[2] || 'px'}`);
  }

  change(box, dir, val) {
    const { name } = this.props;
    box[dir] = val;
    if (isFull(box)) {
      utils.setPropertyValue(
        this.props,
        {
          [name]: `${box.top} ${box.right} ${box.bottom} ${box.left}`,
          [`${name}-top`]: null,
          [`${name}-right`]: null,
          [`${name}-bottom`]: null,
          [`${name}-left`]: null,
        },
      );
    } else {
      utils.setPropertyValue(
        this.props,
        {
          [name]: null,
          [`${name}-top`]: box.top,
          [`${name}-right`]: box.right,
          [`${name}-bottom`]: box.bottom,
          [`${name}-left`]: box.left,
        },
      );
    }
  }

  compute(dir) {
    const { name, node } = this.props;
    // if (external) {
    //   return getComputePropertyValue(node, `${name}-${dir}`);
    // }
    return '0px';
  }

  render() {
    const {
      name, negtive,
    } = this.props;

    const all = utils.getPropertyValue(this.props, name);
    const top = utils.getPropertyValue(this.props, `${name}-top`);
    const right = utils.getPropertyValue(this.props, `${name}-right`);
    const bottom = utils.getPropertyValue(this.props, `${name}-bottom`);
    const left = utils.getPropertyValue(this.props, `${name}-left`);

    const current = compositeMargin(
      all.current,
      top.current,
      right.current,
      bottom.current,
      left.current,
    );

    const inherit = compositeMargin(
      all.inherit,
      top.inherit,
      right.inherit,
      bottom.inherit,
      left.inherit,
    );

    this.current = current;
    this.inherit = inherit;

    return (
      <div
        className={classNames('vs-layout-box', this.props.className)}
        ref={(ref) => {
          this.shell = ref;
        }}
      >
        <div className="vs-layout-handle vs-handle-top" data-handle="top">
          <Icons name="style.handle" className="vs-handle-icon" size="12px" />
        </div>
        <InlineInput
          className="vs-layout-input-top"
          value={current.top}
          inheritValue={inherit.top}
          compute={() => this.compute('top')}
          negtive={negtive}
          highlight={current.top != undefined}
          onChange={val => this.change(current, 'top', val)}
        />

        <div className="vs-layout-handle vs-handle-right" data-handle="right">
          <Icons name="style.handle" className="vs-handle-icon" size="12px" />
        </div>
        <InlineInput
          className="vs-layout-input-right"
          value={current.right}
          inheritValue={inherit.right}
          negtive={negtive}
          highlight={current.right != undefined}
          compute={() => this.compute('right')}
          onChange={val => this.change(current, 'right', val)}
        />

        <div className="vs-layout-handle vs-handle-bottom" data-handle="bottom">
          <span className="vs-handle-inscription">{name}</span>
          <Icons name="style.handle" className="vs-handle-icon" size="12px" />
        </div>
        <InlineInput
          className="vs-layout-input-bottom"
          value={current.bottom}
          inheritValue={inherit.bottom}
          negtive={negtive}
          highlight={current.bottom != undefined}
          compute={() => this.compute('bottom')}
          onChange={val => this.change(current, 'bottom', val)}
        />

        <div className="vs-layout-handle vs-handle-left" data-handle="left">
          <Icons name="style.handle" className="vs-handle-icon" size="12px" />
        </div>
        <InlineInput
          className="vs-layout-input-left"
          value={current.left}
          inheritValue={inherit.left}
          negtive={negtive}
          highlight={current.left != undefined}
          compute={() => this.compute('left')}
          onChange={val => this.change(current, 'left', val)}
        />
      </div>
    );
  }
}

class MarginAuto extends Component {
  static propTypes = {
    prop: PropTypes.object,
  };

  setAuto(box) {
    box.left = 'auto';
    box.right = 'auto';
    if (isFull(box)) {
      utils.setPropertyValue(
        this.props,
        {
          margin: `${box.top} ${box.right} ${box.bottom} ${box.left}`,
          'margin-top': null,
          'margin-right': null,
          'margin-bottom': null,
          'margin-left': null,
        },
      );
    } else {
      utils.setPropertyValue(
        this.props,
        {
          margin: null,
          'margin-top': box.top,
          'margin-right': box.right,
          'margin-bottom': box.bottom,
          'margin-left': box.left,
        },
      );
    }
  }

  render() {
    const all = utils.getPropertyValue(this.props, 'margin');
    const top = utils.getPropertyValue(this.props, 'margin-top');
    const bottom = utils.getPropertyValue(this.props, 'margin-bottom');
    const right = utils.getPropertyValue(this.props, 'margin-right');
    const left = utils.getPropertyValue(this.props, 'margin-left');

    const current = compositeMargin(
      all.current,
      top.current,
      right.current,
      bottom.current,
      left.current,
    );

    const inherit = compositeMargin(
      all.inherit,
      top.inherit,
      right.inherit,
      bottom.inherit,
      left.inherit,
    );

    const eright = utils.isEmptyCssValue(current.right) ? inherit.right : current.right;
    const eleft = utils.isEmptyCssValue(current.left) ? inherit.left : current.left;

    const className = classNames('vs-margin-auto', {
      've-active': eright === 'auto' && eleft === 'auto',
    });

    return (
      <Button
        className={className}
        name="style.auto"
        size="medium"
        onClick={() => this.setAuto(current)}
      />
    );
  }
}

class PaddingMargin extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-layout-padding-margin', this.props.className);

    return (
      <div className={className}>
        <LayoutBox
          className="vs-margin-box"
          name="margin"
          negtive
          {...this.props}
        />

        <LayoutBox className="vs-padding-box" name="padding" {...this.props} />

        <MarginAuto {...this.props} />
      </div>
    );
  }
}

export default PaddingMargin;
